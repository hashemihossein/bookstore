import { Test, TestingModule } from '@nestjs/testing';
import { DocumentAggregatorController } from './document-aggregator.controller';
import { DocumentAggregatorService } from './document-aggregator.service';

describe('DocumentAggregatorController', () => {
  let documentAggregatorController: DocumentAggregatorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DocumentAggregatorController],
      providers: [DocumentAggregatorService],
    }).compile();

    documentAggregatorController = app.get<DocumentAggregatorController>(DocumentAggregatorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(documentAggregatorController.getHello()).toBe('Hello World!');
    });
  });
});
