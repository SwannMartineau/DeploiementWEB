import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.model';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Conversation])
  async getAllConversations(): Promise<Conversation[]> {
    return this.conversationService.getAllConversations();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Conversation)
  async getConversationById(@Args('conversationID', { type: () => Int }) conversationID: number): Promise<Conversation> {
    return this.conversationService.getConversationById(conversationID);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Conversation])
  async getAllConversationsByParticipantId(@Args('participantID', { type: () => Int }) participantID: number): Promise<Conversation[]> {
    return this.conversationService.getAllConversationsByParticipantId(participantID);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Conversation)
  async createConversation(
    @Args('user1Id', { type: () => Int }) user1Id: number,
    @Args('user2Id', { type: () => Int }) user2Id: number,
  ): Promise<Conversation> {
    const user1 = this.userService.getUserById(user1Id);
    const user2 = this.userService.getUserById(user2Id);
    return this.conversationService.createConversation(await user1, await user2);
  }

  @Mutation(() => Boolean) // Indique que cette mutation retourne un booléen
  async deleteConversationById(
    @Args('conversationID', { type: () => Int }) conversationID: number,
  ): Promise<boolean> {
    return this.conversationService.deleteConversationById(conversationID);
  }
}
