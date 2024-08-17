import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@app/db';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':email')
  async findOne(@Param('email') email: string): Promise<Partial<User>> {
    return this.usersService.findOne(email);
  }

  @Patch(':email')
  async update(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    return this.usersService.update(email, updateUserDto);
  }

  @Patch(':email/password')
  async updatePassword(
    @Param('email') email: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Partial<User>> {
    return this.usersService.updatePassword(email, updatePasswordDto);
  }
}
