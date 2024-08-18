import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '@app/db';
import { Admin } from '@app/rbac/admin.decorator';
import { SearchBooksDto } from './dto/search-books.dto';
import { UserDecorator } from '@app/jwt/decorator/user.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Admin()
  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get('search')
  async searchBooks(
    @Query() query: SearchBooksDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @UserDecorator() user: any,
  ) {
    return this.booksService.searchBooks(query, +page, +limit, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Admin()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Admin()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Book> {
    return this.booksService.remove(id);
  }
}
