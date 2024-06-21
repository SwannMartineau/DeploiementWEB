import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.model';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Query(() => [Conversation])
  async getAllConversations(): Promise<Conversation[]> {
    return this.conversationService.getAllConversations();
  }

  @Query(() => Conversation)
  async getConversationById(@Args('conversationID', { type: () => Int }) conversationID: number): Promise<Conversation> {
    return this.conversationService.getConversationById(conversationID);
  }

  @Query(() => [Conversation])
  async getAllConversationsByParticipantId(@Args('participantID', { type: () => Int }) participantID: number): Promise<Conversation[]> {
    return this.conversationService.getAllConversationsByParticipantId(participantID);
  }
}
