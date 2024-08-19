import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, JwtModule } from '@app/jwt';
import { AdminGuard } from '@app/rbac/admin.guard';
import { RabbitMQModule } from '@app/rabbit-mq';
@Module({
  imports: [BooksModule, JwtModule, RabbitMQModule.register()],
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
