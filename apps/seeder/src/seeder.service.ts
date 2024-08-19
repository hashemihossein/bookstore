import { CacheService } from '@app/cache';
import { Book, User } from '@app/db';
import { CartItem } from '@app/db/schemas/cart-item.schema';
import { Cart } from '@app/db/schemas/cart.schema';
import { JwtService } from '@app/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItem>,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}
  async initializer(): Promise<any> {
    const message = {
      global:
        'Be aware of, each time you call the seeder endpoint, all collections will be droped and initialize from the beginning!',
      userDescription: '',
      bookDescription: '',
      cartDescription: '',
    };

    // users collection initializing:

    await this.userModel.deleteMany();

    const password1 = await bcrypt.hash('@Admin1234', 10);
    const user1 = new this.userModel({
      username: 'Admin',
      email: 'Admin@Admin.com',
      password: password1,
      isPremium: true,
      role: 'admin',
    });

    const accessToken1 = this.jwtService.sign({
      id: user1._id,
    });

    const password2 = await bcrypt.hash('@Test1234', 10);
    const user2 = new this.userModel({
      username: 'Test',
      email: 'Test@Test.com',
      password: password2,
      isPremium: false,
      role: 'user',
    });

    const accessToken2 = this.jwtService.sign({
      id: user2._id,
    });

    await user1.save();
    await user2.save();

    message.userDescription = `Two users added to 'Users' collection. One with premium access and admin privilege. Its username is 'Admin' and its password is '@Admin1234'. You can access through endpoints with this User information by using this token: '${accessToken1}' . And another one have access to non-premium books and didn't have any access to administration endpoints. You can access through endpoints with this User information by using this token: '${accessToken2}' . `;

    // books collection initializing:

    await this.bookModel.deleteMany();

    const book1 = new this.bookModel({
      title: 'One Piece',
      author: 'Eiichiro Oda',
      description:
        "One Piece is a Japanese manga series written and illustrated by Eiichiro Oda. It has been serialized in Shueisha's shōnen manga magazine Weekly Shōnen Jump since July 1997, with its individual chapters compiled in 109 tankōbon volumes as of July 2024.",
      genre: 'manga',
      releaseDate: Date.now(),
      price: 1000000,
      isPremium: true,
    });

    const book2 = new this.bookModel({
      title: 'Moby-Dick',
      author: 'Herman Melville',
      description:
        "Moby-Dick; or, The Whale is an 1851 novel by American writer Herman Melville. The book is the sailor Ishmael's narrative of the maniacal quest of Ahab, captain of the whaling ship Pequod, for vengeance against Moby Dick, the giant white sperm whale that bit off his leg on the ship's previous voyage.",
      genre: 'comics',
      releaseDate: Date.now(),
      price: 250000,
      isPremium: false,
    });

    await book1.save();
    await book2.save();

    message.bookDescription = `Two new books added to 'Books' collection with names of 'Moby-Dick' and 'One Piece', that you can search among them. 'Moby-Dick' is a public book and 'One Piece' is available only for premium users`;

    // carts and cart-items collection initializing:

    await this.cartItemModel.deleteMany();
    await this.cartModel.deleteMany();

    const cart1 = new this.cartModel({ user: new Types.ObjectId(user1.id) });
    const cart2 = new this.cartModel({ user: new Types.ObjectId(user2.id) });

    const cartItem1 = new this.cartItemModel({
      book: new Types.ObjectId(book1.id),
      quantity: 5,
      cart: new Types.ObjectId(cart1.id),
    });
    const cartItem2 = new this.cartItemModel({
      book: new Types.ObjectId(book2.id),
      quantity: 5,
      cart: new Types.ObjectId(cart2.id),
    });

    cart1.items.push(cartItem1.id);
    cart2.items.push(cartItem2.id);

    await cart1.save();
    await cart2.save();
    await cartItem1.save();
    await cartItem2.save();

    this.cacheService.deleteAll();

    message.cartDescription = `Adding one shopping cart to each user with one item at each that you access them through /cart endpoint`;
    return message;
  }
}
