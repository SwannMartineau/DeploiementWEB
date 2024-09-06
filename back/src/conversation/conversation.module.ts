import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { UserModule } from 'src/user/user.module';
import { Conversation } from './conversation.model';
import { Message } from 'src/message/message.model';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Conversation, Message]), // Ajoute les dépôts ici
  ],
  providers: [ConversationService, ConversationResolver],
  exports: [ConversationService],
})
export class ConversationModule {}
