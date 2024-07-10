import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import { User } from '../user/user.model';

@Injectable()
export class MessageService {
  private nextMessageId = 1;
  private messages: Message[] = [];

  constructor(
    @InjectQueue('message-queue') private readonly messageQueue: Queue,
  ) {}

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

  async sendUserMessage(content: string, fromUser: User, conversation: Conversation): Promise<Message> {
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

  async addMessageJob(content: string, fromUserId: number, conversationId: number) {
    await this.messageQueue.add('save-message', {
      content,
      fromUserId,
      conversationId,
    });
  }
}
