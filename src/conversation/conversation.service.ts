import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.model';
import { User } from '../user/user.model';

@Injectable()
export class ConversationService {
  private nextConversationId = 1;
  private conversations: Conversation[] = [];

  constructor() {}

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

  createConversation(user1: User, user2: User): Conversation {
    const newConversation: Conversation = {
      conversationID: this.nextConversationId++,
      participants: [user1, user2],
      messages: [],
    };
    this.conversations.push(newConversation);
    return newConversation;
  }
}
