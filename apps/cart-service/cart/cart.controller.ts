import { UserDecorator } from '@app/jwt/decorator/user.decorator';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Cart } from '@app/db/schemas/cart.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@UserDecorator() user: any) {
    return this.cartService.getCart(user);
  }

  @Post()
  async addToCart(
    @UserDecorator() user: any,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<Cart> {
    return this.cartService.addToCart(user, addToCartDto);
  }

  @Delete(':id')
  async removeFromCart(
    @UserDecorator() user: any,
    @Param('id') id: string,
  ): Promise<Cart> {
    return this.cartService.removeFromCart(user, id);
  }

  @Delete()
  async deleteCart(@UserDecorator() user: any): Promise<void> {
    return this.cartService.deleteCart(user);
  }

  @Post('payment')
  async payment(@UserDecorator() user: any): Promise<any> {
    return this.cartService.payment(user);
  }
}
