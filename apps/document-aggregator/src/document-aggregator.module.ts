import { Module } from '@nestjs/common';
import { DocumentAggregatorController } from './document-aggregator.controller';
import { DocumentAggregatorService } from './document-aggregator.service';

@Module({
  imports: [],
  controllers: [DocumentAggregatorController],
  providers: [DocumentAggregatorService],
})
export class DocumentAggregatorModule {}
