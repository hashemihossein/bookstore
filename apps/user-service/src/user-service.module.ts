import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard, JwtModule } from '@app/jwt';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule, JwtModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class UserServiceModule {}
