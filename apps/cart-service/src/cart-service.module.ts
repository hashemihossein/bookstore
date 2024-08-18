import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { JwtAuthGuard, JwtModule } from '@app/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard } from '@app/rbac/admin.guard';

@Module({
  imports: [CartModule, JwtModule],
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
export class CartServiceModule {}
