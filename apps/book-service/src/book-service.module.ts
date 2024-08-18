import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, JwtModule } from '@app/jwt';
import { AdminGuard } from '@app/rbac/admin.guard';
@Module({
  imports: [BooksModule, JwtModule],
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
