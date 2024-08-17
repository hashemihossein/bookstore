import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/sinup.dto';
import { LoginDto } from './dto/login.dto';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { JwtService } from '@app/jwt';

@Injectable()
export class AuthService {
  private userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
  }

  async login(loginDto: LoginDto) {
    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.post(
          `${this.userServiceUrl}/users/validate`,
          loginDto,
        ),
      );

      const accessToken = this.jwtService.sign({
        _id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        isPremium: response.data.isPremium,
      });

      return { ...response.data, access_token: 'Bearer ' + accessToken };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signup(signupDto: SignupDto) {
    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.post(`${this.userServiceUrl}/users`, signupDto),
      );

      const accessToken = this.jwtService.sign({
        _id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        isPremium: response.data.isPremium,
      });
      return { ...response.data, access_token: 'Bearer ' + accessToken };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
