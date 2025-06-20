import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma Client connected');
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
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
        password: hashSync(password, 10),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return {
      user,
      token: 'ABC',
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new RpcException({
        status: 400,
        message: 'User/Password invalid',
      });
    }

    const isPasswordEqual = compareSync(loginUserDto.password, user.password);

    if (!isPasswordEqual) {
      throw new RpcException({
        status: 400,
        message: 'User/Password invalid',
      });
    }

    const { id, name, email } = user;

    return {
      user: {
        id,
        name,
        email,
      },
      token: await this.signJWT({
        id,
        name,
        email,
      }),
    };
  }
}
