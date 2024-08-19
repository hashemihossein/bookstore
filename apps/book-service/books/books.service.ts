import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from '@app/db';
import { Model } from 'mongoose';
import { CacheService } from '@app/cache';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    private readonly cacheService: CacheService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async searchBooks(
    query: Record<string, any>,
    page: number,
    limit: number,
    user: any,
  ) {
    const { title, author, genre, q } = query;

    const filter: any = {};

    if (user.role !== 'admin' && user.isPremium !== true) {
      filter.isPremium = false;
    }

    const matchConditions: any[] = [];

    if (title) {
      matchConditions.push({ title: { $regex: title, $options: 'i' } });
    }
    if (author) {
      matchConditions.push({ author: { $regex: author, $options: 'i' } });
    }
    if (genre) {
      matchConditions.push({ genre: { $regex: genre, $options: 'i' } });
    }
    if (q) {
      matchConditions.push({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } },
          { genre: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ],
      });
    }

    const queryConditions: any =
      matchConditions.length > 0 ? { $and: matchConditions } : {};

    const queryOptions = {
      page,
      limit,
    };
    const books = await this.bookModel
      .find({
        ...filter,
        ...queryConditions,
      })
      .skip((queryOptions.page - 1) * queryOptions.limit)
      .limit(queryOptions.limit)
      .exec();

    return books;
  }

  async findOne(id: string, user: any): Promise<Book> {
    const cacheKey = { id };

    const cachedBook = await this.cacheService.get(JSON.stringify(cacheKey));

    if (cachedBook) {
      if (cachedBook.isPremium === true && user.isPremium === false) {
        throw new ForbiddenException("You don't have Premium access");
      }
      return cachedBook;
    }

    const book = await this.bookModel.findById(id).exec();

    await this.cacheService.set(JSON.stringify(cacheKey), book, 3600);

    if (book.isPremium === true && user.isPremium === false) {
      throw new ForbiddenException("You don't have Premium access");
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, {
        new: true,
      })
      .exec();

    await this.cacheService.set(JSON.stringify(id), book, 3600);
    return book;
  }

  async remove(id: string): Promise<Book> {
    let book = await this.bookModel.findByIdAndDelete(id).exec();
    await this.cacheService.delete(id);
    return book;
  }

  async localGetBook(id: string): Promise<Book> {
    const cacheKey = { id };

    const cachedBook = await this.cacheService.get(JSON.stringify(cacheKey));

    if (cachedBook) {
      return cachedBook;
    }

    const book = await this.bookModel.findById(id).exec();

    await this.cacheService.set(JSON.stringify(cacheKey), book, 3600);

    return book;
  }
}
