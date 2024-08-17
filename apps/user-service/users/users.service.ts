import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@app/db';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      await createdUser.save();
      return this.userSanitizer(createdUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(email: string): Promise<Partial<User>> {
    const user = await this.userModel
      .findOne({ email })
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return this.userSanitizer(user);
  }

  async update(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (!existingUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (updateUserDto.username) {
      existingUser.username = updateUserDto.username;
    }
    if (updateUserDto.isPremium !== undefined) {
      existingUser.isPremium = updateUserDto.isPremium;
    }

    try {
      await existingUser.save();
      return this.userSanitizer(existingUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async updatePassword(
    email: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Partial<User>> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (!existingUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const isMatch = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      existingUser.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    existingUser.password = hashedPassword;

    try {
      await existingUser.save();
      return this.userSanitizer(existingUser);
    } catch (error) {
      throw error;
    }
  }

  private userSanitizer(user: UserDocument): Partial<User> {
    const { password, role, isPremium, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }
}
