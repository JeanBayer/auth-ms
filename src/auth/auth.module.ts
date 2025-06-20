import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transport/nats.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [NatsModule],
})
export class AuthModule {}
