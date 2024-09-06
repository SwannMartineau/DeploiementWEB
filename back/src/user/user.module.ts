import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './user.model';
import { Conversation } from 'src/conversation/conversation.model';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Conversation]), SocketModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}