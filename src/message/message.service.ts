import { Injectable } from '@nestjs/common';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import { User } from '../user/user.model';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
  private nextMessageId = 1;
  private messages: Message[] = [];

  constructor(private readonly conversationService: ConversationService) {}

  getAllMessages(): Message[] {
    return this.messages;
  }

  getMessageById(id: number): Message {
    return this.messages.find(message => message.messageID === id);
  }

  getAllMessagesByUserId(userID: number): Message[] {
    return this.messages.filter(message => message.fromUser.userID === userID);
  }

  getAllMessagesByConversationId(conversationID: number): Message[] {
    return this.messages.filter(message => message.conversation.conversationID === conversationID);
  }

  sendMessage(content: string, fromUser: User, conversation: Conversation): Message {
    const newMessage: Message = {
      messageID: this.nextMessageId++,
      content,
      fromUser,
      conversation,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(newMessage);
    conversation.messages.push(newMessage);
    return newMessage;
  }
}
