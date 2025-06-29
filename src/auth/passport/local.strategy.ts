import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  Dependencies,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(username, password) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Email / password không hợp lệ!');
    }
    if (!user.is_active) {
      throw new BadRequestException('Tài khoản chưa được kích hoạt');
    }
    return user;
  }
}
