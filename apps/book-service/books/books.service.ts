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

  findAll() {
    return `This action returns all books`;
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
