import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './message.model';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversation/conversation.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async getAllMessages(): Promise<Message[]> {
    return this.messageService.getAllMessages();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Message)
  async getMessageById(@Args('messageID', { type: () => Int }) messageID: number): Promise<Message> {
    return this.messageService.getMessageById(messageID);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async getAllMessagesByUserId(@Args('userID', { type: () => Int }) userID: number): Promise<Message[]> {
    return this.messageService.getAllMessagesByUserId(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async getAllMessagesByConversationId(@Args('conversationID', { type: () => Int }) conversationID: number): Promise<Message[]> {
    return this.messageService.getAllMessagesByConversationId(conversationID);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message)
  async sendMessage(
    @Args('content') content: string,
    @Args('fromUserID', { type: () => Int }) fromUserId: number,
    @Args('conversationID', { type: () => Int }) conversationId: number,
  ): Promise<Message> {
    const res = await this.messageService.addMessageJob(content, fromUserId, conversationId);
    return res.data;
  }
}