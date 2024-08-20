import { NestFactory } from '@nestjs/core';
import { DocumentAggregatorModule } from './document-aggregator.module';

async function bootstrap() {
  const app = await NestFactory.create(DocumentAggregatorModule);
  await app.listen(3000);
}
bootstrap();
