import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../jwt.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@app/db';
import { Model } from 'mongoose';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userModel.findById(payload.id).exec();
      if (!user) {
        throw new UnauthorizedException('token expired');
      }
      const { password, ...sanitizeUser } = user.toObject();
      request.user = sanitizeUser;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
