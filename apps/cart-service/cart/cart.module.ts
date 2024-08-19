import { DbModule } from '@app/db';
import { CartItem, CartItemSchema } from '@app/db/schemas/cart-item.schema';
import { Cart, CartSchema } from '@app/db/schemas/cart.schema';
import { RabbitMQModule } from '@app/rabbit-mq';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
@Module({
  imports: [
    DbModule,
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    HttpModule,
    RabbitMQModule.register(),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
