import { Module } from '@nestjs/common';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';
import { Book, BookSchema, DbModule, User, UserSchema } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '@app/db/schemas/cart.schema';
import { CartItem, CartItemSchema } from '@app/db/schemas/cart-item.schema';
import { JwtModule } from '@app/jwt';
import { CacheModule } from '@app/cache';

@Module({
  imports: [
    DbModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: Cart.name, schema: CartSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    JwtModule,
    CacheModule,
  ],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
