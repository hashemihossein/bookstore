import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/jwt';
@Module({
  imports: [BooksModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class BookServiceModule {}
