import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  sign(payload: string | object, options?: JwtSignOptions): string {
    if (typeof payload == 'object') {
      return this.nestJwtService.sign(JSON.stringify(payload), options);
    }
    return this.nestJwtService.sign(payload, options);
  }

  verify(token: string): any {
    return this.nestJwtService.verify(token);
  }
}
