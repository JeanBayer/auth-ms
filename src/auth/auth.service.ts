import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from 'generated/prisma';
import { NATS_SERVICE } from 'src/config/services';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma Client connected');
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    const existUser = await this.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new RpcException({
        status: 400,
        message: 'User is already exist',
      });
    }

    const user = await this.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return {
      user,
      token: 'ABC',
    };
  }
}
