import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MessageProcessor } from './message.processor';
import { UserModule } from '../user/user.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
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
  ],
  providers: [MessageService, MessageResolver, MessageProcessor],
  exports: [MessageService],
})
export class MessageModule {}
