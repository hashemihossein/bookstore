import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DocumentAggregatorService {
  private servicesUrl: string[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.servicesUrl.push(this.configService.get<string>('AUTH_SERVICE_URL'));
    this.servicesUrl.push(this.configService.get<string>('BOOK_SERVICE_URL'));
    this.servicesUrl.push(this.configService.get<string>('CART_SERVICE_URL'));
    this.servicesUrl.push(this.configService.get<string>('USER_SERVICE_URL'));
  }

  async getMergedDocuments(): Promise<any> {
    let mergedPaths = {};
    let mergedComponents = {};
    for (let i = 0; i < this.servicesUrl.length; i++) {
      const url = this.servicesUrl[i];
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${url}/api-document-json`),
      );
      const doc: any = response.data;
      mergedPaths = { ...mergedPaths, ...doc.paths };
      mergedComponents = { ...mergedComponents, ...doc.components?.schemas };
    }

    return {
      paths: mergedPaths,
      components: {
        schemas: mergedComponents,
      },
    };
  }

  private mergeSwaggerDocs(doc1: any, doc2: any): any {
    const mergedPaths = { ...doc1.paths, ...doc2.paths };

    // Merge the definitions (components in OpenAPI 3)
    const mergedComponents = {
      ...doc1.components?.schemas,
      ...doc2.components?.schemas,
    };

    return {
      ...doc1,
      paths: mergedPaths,
      components: {
        schemas: mergedComponents,
      },
    };
  }
}
