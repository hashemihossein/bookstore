import { NestFactory } from '@nestjs/core';
import { DocumentAggregatorModule } from './document-aggregator.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DocumentAggregatorService } from './document-aggregator.service';

async function bootstrap() {
  const app = await NestFactory.create(DocumentAggregatorModule);

  const config = new DocumentBuilder()
    .setTitle('Bookstore API Documentation')
    .setDescription('Documentation for bookstore microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerMergeService = app.get(DocumentAggregatorService);
  const mergedSwagger = await swaggerMergeService.getMergedDocuments();

  const document = SwaggerModule.createDocument(app, config);

  const bookstoreDocument = {
    ...document,
    paths: { ...mergedSwagger.paths },
    components: {
      schemas: {
        ...mergedSwagger.components?.schemas,
      },
    },
  };

  SwaggerModule.setup('api-docs', app, bookstoreDocument);

  await app.listen(3000);
}
bootstrap();
