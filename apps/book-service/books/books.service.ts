import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from '@app/db';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
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
    console.log(filter, queryConditions);
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

  async findOne(id: string): Promise<Book> {
    return this.bookModel.findById(id).exec();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    return this.bookModel
      .findByIdAndUpdate(id, updateBookDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<Book> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
