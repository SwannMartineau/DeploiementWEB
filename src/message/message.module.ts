import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { UserModule } from '../user/user.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [UserModule, ConversationModule],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
