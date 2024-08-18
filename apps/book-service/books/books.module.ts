import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema, DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@app/cache';

@Module({
  imports: [
    DbModule,
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    CacheModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
