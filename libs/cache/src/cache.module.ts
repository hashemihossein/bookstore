import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    CacheService,
    {
      provide: 'MEMCACHED_CLIENT',
      useFactory: (configService: ConfigService) => {
        const Memcached = require('memcached');
        return new Memcached(configService.get<string>('MEMCACHED_SERVER'));
      },
      inject: [ConfigService],
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
