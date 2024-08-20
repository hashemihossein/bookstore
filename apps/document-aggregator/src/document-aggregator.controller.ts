import { Controller, Get } from '@nestjs/common';
import { DocumentAggregatorService } from './document-aggregator.service';

@Controller()
export class DocumentAggregatorController {
  constructor(private readonly documentAggregatorService: DocumentAggregatorService) {}

  @Get()
  getHello(): string {
    return this.documentAggregatorService.getHello();
  }
}
