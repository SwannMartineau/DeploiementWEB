import { Injectable } from '@nestjs/common';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import { User } from '../user/user.model';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
  /* private users: User[] = [
    { userID: 1, firstName: 'John', lastName: 'Doe' },
    { userID: 2, firstName: 'Jane', lastName: 'Smith' },
  ]; */

  /* private conversations: Conversation[] = [
    {
      conversationID: 1,
      participants: [
        { userID: 1, firstName: 'John', lastName: 'Doe' },
        { userID: 2, firstName: 'Jane', lastName: 'Smith' },
      ],
      messages: [], // Will be updated after initialization
    },
  ]; */

  private nextMessageId = 1;
  private messages: Message[] = [
    /* {
      messageID: 1,
      content: 'Hello World',
      fromUser: this.users[0],
      conversation: this.conversations[0],
      timestamp: new Date().toISOString(),
    },
    {
      messageID: 2,
      content: 'NestJS is great',
      fromUser: this.users[1],
      conversation: this.conversations[0],
      timestamp: new Date().toISOString(),
    }, */
  ];

  constructor(private readonly conversationService: ConversationService) {
    // Initialize the conversation field in messages
    /* this.conversations.forEach(conversation => {
      conversation.messages = this.messages.filter(
        message => message.conversation.conversationID === conversation.conversationID,
      );
    }); */
  }

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
