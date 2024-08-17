import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard, JwtModule } from '@app/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard } from '@app/rbac/admin.guard';

@Module({
  imports: [UsersModule, JwtModule],
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
export class UserServiceModule {}
