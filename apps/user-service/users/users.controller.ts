import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@app/db';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Public } from '@app/jwt';
import { UserDecorator } from '@app/jwt/decorator/user.decorator';
import { Admin } from '@app/rbac/admin.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Protected Admin Endpoint',
    description: 'This endpoint is only accessible to admin users.',
  })
  @Admin()
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Public()
  @Post('validate')
  async validate(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<Partial<User>> {
    return this.usersService.validate(email, password);
  }

  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @UserDecorator() user: any,
  ): Promise<Partial<User>> {
    return this.usersService.update(updateUserDto, user);
  }

  @Patch('updatePassword')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @UserDecorator() user: any,
  ): Promise<Partial<User>> {
    return this.usersService.updatePassword(updatePasswordDto, user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Protected Admin Endpoint',
    description: 'This endpoint is only accessible to admin users.',
  })
  @Admin()
  @Post('makeAdmin')
  async makeAdmin(@Body('userId') userId: string) {
    return this.usersService.makeAdmin(userId);
  }
}
