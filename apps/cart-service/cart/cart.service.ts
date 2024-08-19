import { CartItem } from '@app/db/schemas/cart-item.schema';
import { Cart } from '@app/db/schemas/cart.schema';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { firstValueFrom, timeout } from 'rxjs';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItem>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getCart(user: any): Promise<Cart> {
    const cart = await this.cartModel
      .findOne({
        user: new Types.ObjectId(user._id),
        status: 'cart',
      })
      .populate({
        path: 'items',
        model: 'CartItem',
        populate: {
          path: 'book',
          model: 'Book',
        },
      });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async addToCart(user: any, addToCartDto: AddToCartDto): Promise<Cart> {
    let book = await firstValueFrom(
      this.client
        .send({ cmd: 'localGetBook' }, addToCartDto.book)
        .pipe(timeout(5000)),
    );

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (
      book.isPremium === true &&
      user.isPremium === false &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException("You don't have Premium access");
    }

    let cart = await this.cartModel.findOne({
      user: new Types.ObjectId(user._id),
      status: 'cart',
    });

    if (!cart) {
      cart = new this.cartModel({ user: new Types.ObjectId(user._id) });
    }

    let cartItem = await this.cartItemModel.findOne({
      book: new Types.ObjectId(addToCartDto.book),
      cart: new Types.ObjectId(cart.id),
    });

    console.log(cart.id, addToCartDto.book);
    console.log(cartItem, ':DD:D');

    if (!cartItem) {
      cartItem = new this.cartItemModel({
        book: new Types.ObjectId(addToCartDto.book),
        cart: new Types.ObjectId(cart.id),
      });
      cart.items.push(cartItem.id);
    }

    cartItem.quantity += addToCartDto.quantity;
    await cartItem.save();
    await cart.save();

    return cart.populate({
      path: 'items',
      model: 'CartItem',
      populate: {
        path: 'book',
        model: 'Book',
      },
    });
  }

  async removeFromCart(user: any, id: string): Promise<Cart> {
    let book;
    try {
      book = await firstValueFrom(
        this.client
          .send({ cmd: 'localGetBook' }, new Types.ObjectId(id))
          .pipe(timeout(5000)),
      );
    } catch (error) {
      throw new Error(error);
    }

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    if (
      book.isPremium === true &&
      user.isPremium === false &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException("You don't have Premium access");
    }

    let cart = await this.cartModel.findOne({
      user: new Types.ObjectId(user._id),
      status: 'cart',
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    let cartItem = await this.cartItemModel.findOne({
      book: new Types.ObjectId(id),
      cart: new Types.ObjectId(cart.id),
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found');
    }

    cartItem.quantity -= 1;
    if (cartItem.quantity == 0) {
      cart.items.filter((item) => item != cartItem.id);

      await cart.save();
      await cartItem.deleteOne();
    } else {
      await cartItem.save();
    }

    return cart.populate({
      path: 'items',
      model: 'CartItem',
      populate: {
        path: 'book',
        model: 'Book',
      },
    });
  }

  async deleteCart(user: any): Promise<void> {
    try {
      await this.cartModel.findOneAndDelete({
        user: new Types.ObjectId(user._id),
        status: 'cart',
      });
    } catch (error) {
      throw error;
    }
  }

  async payment(user: any): Promise<any> {
    const cart = await this.cartModel
      .findOne({
        user: new Types.ObjectId(user._id),
        status: 'cart',
      })
      .populate({
        path: 'items',
        model: 'CartItem',
        populate: {
          path: 'book',
          model: 'Book',
        },
      });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const amount = cart.items.reduce((total, item) => {
      return total + item.book.price * item.quantity;
    }, 0);

    // post requert to payment service provider (  dto: { amount, orderId, callbackURL, description }  )

    cart.status = 'pending';
    await cart.save();
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const autority: string = Buffer.from(cart.id, 'utf8').toString(
            'base64',
          );
          resolve(
            this.paymentCallbackFunction(cart.id, 'OK', autority, amount),
          );
        }, 3000);
      });
    } catch (error) {
      cart.status = 'unpaid';
      return await cart.save();
    }
  }

  async paymentCallbackFunction(
    orderId: Types.ObjectId,
    status: string,
    autority: string,
    amount: number,
  ): Promise<Cart> {
    if (status === 'OK') {
      const cart = await this.cartModel
        .findOne({ _id: new Types.ObjectId(orderId), status: 'pending' })
        .populate({
          path: 'items',
          model: 'CartItem',
          populate: {
            path: 'book',
            model: 'Book',
          },
        });
      if (!cart) {
        throw new NotFoundException('Cart not found, payment Failed');
      }

      const totalAmount = cart.items.reduce((total, item) => {
        return total + item.book.price * item.quantity;
      }, 0);

      if (totalAmount !== amount) {
        throw new ConflictException(
          'Cart total price mismatch, payment Failed',
        );
      }

      cart.status = 'paid';
      cart.autority = autority;
      return cart.save();
      // post request for verify to payment service provider ( dto: {price , autority} )
    }
  }
}
