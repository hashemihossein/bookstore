import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema, DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@app/cache';
import { RabbitMQModule } from '@app/rabbit-mq';

@Module({
  imports: [
    DbModule,
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    CacheModule,
    RabbitMQModule.register(),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
