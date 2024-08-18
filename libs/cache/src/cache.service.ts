import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject('MEMCACHED_CLIENT') private readonly memcachedClient) {}

  async get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.memcachedClient.get(key, (err, data) => {
        if (err) {
          this.logger.error(`Failed to get key ${key}`, err.stack);
          return reject(err);
        }
        if (!data) {
          return resolve(null);
        }
        return resolve(JSON.parse(data));
      });
    });
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.memcachedClient.set(key, JSON.stringify(value), ttl, (err) => {
        if (err) {
          this.logger.error(`Failed to set key ${key}`, err.stack);
          return reject(err);
        }
        resolve();
      });
    });
  }
}
