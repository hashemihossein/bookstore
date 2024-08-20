import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '@app/db';
import { Admin } from '@app/rbac/admin.decorator';
import { SearchBooksDto } from './dto/search-books.dto';
import { UserDecorator } from '@app/jwt/decorator/user.decorator';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Public } from '@app/jwt';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Protected Admin Endpoint',
    description: 'This endpoint is only accessible to admin users.',
  })
  @Admin()
  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get('')
  async searchBooks(
    @Query() query: SearchBooksDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @UserDecorator() user: any,
  ) {
    return this.booksService.searchBooks(query, +page, +limit, user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @UserDecorator() user: any,
  ): Promise<Book> {
    return this.booksService.findOne(id, user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Protected Admin Endpoint',
    description: 'This endpoint is only accessible to admin users.',
  })
  @Admin()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Protected Admin Endpoint',
    description: 'This endpoint is only accessible to admin users.',
  })
  @Admin()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Book> {
    return this.booksService.remove(id);
  }

  @Public()
  @MessagePattern({ cmd: 'localGetBook' })
  async localGetBook(id: string): Promise<Book> {
    return this.booksService.localGetBook(id);
  }
}
