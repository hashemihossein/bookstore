import { Module } from '@nestjs/common';
import { DocumentAggregatorService } from './document-aggregator.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [DocumentAggregatorService],
})
export class DocumentAggregatorModule {}
