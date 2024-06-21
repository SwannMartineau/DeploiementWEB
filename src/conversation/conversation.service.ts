import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.model';
import { User } from '../user/user.model';
import { Message } from '../message/message.model';

@Injectable()
export class ConversationService {
  private conversations: Conversation[] = [
    {
      conversationID: 1,
      participants: [
        { userID: 1, firstName: 'John', lastName: 'Doe' },
        { userID: 2, firstName: 'Jane', lastName: 'Smith' },
      ],
      messages: [
        {
          messageID: 1,
          content: 'Hello World',
          fromUser: { userID: 1, firstName: 'John', lastName: 'Doe' },
          conversation: null, // Will be updated after initialization
          timestamp: new Date().toISOString(),
        },
        {
          messageID: 2,
          content: 'NestJS is great',
          fromUser: { userID: 2, firstName: 'Jane', lastName: 'Smith' },
          conversation: null, // Will be updated after initialization
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ];

  constructor() {
    // Initialize the conversation field in messages
    this.conversations.forEach(conversation => {
      conversation.messages.forEach(message => {
        message.conversation = conversation;
      });
    });
  }

  getAllConversations(): Conversation[] {
    return this.conversations;
  }

  getConversationById(conversationID: number): Conversation {
    return this.conversations.find(conversation => conversation.conversationID === conversationID);
  }

  getAllConversationsByParticipantId(participantId: number): Conversation[] {
    return this.conversations.filter(conversation =>
      conversation.participants.some(participant => participant.userID === participantId),
    );
  }
}
