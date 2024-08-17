import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/jwt';
import { AdminGuard } from '@app/rbac/admin.guard';
@Module({
  imports: [BooksModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class BookServiceModule {}
