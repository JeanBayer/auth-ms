import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser() {
    return 'register';
  }

  @MessagePattern('auth.login.user')
  loginUser() {
    return 'login';
  }

  @MessagePattern('auth.verify.user')
  verifyToken() {
    return 'verify';
  }
}
