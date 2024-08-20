import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentAggregatorService {
  getHello(): string {
    return 'Hello World!';
  }
}
