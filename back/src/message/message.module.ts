import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MessageProcessor } from './message.processor';
import { UserModule } from '../user/user.module';
import { ConversationModule } from '../conversation/conversation.module';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import { User } from '../user/user.model';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation, User]),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    UserModule,
    ConversationModule,
    SocketModule,
  ],
  providers: [MessageService, MessageResolver, MessageProcessor],
  exports: [MessageService],
})
export class MessageModule {}
