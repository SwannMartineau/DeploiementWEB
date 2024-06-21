import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './message.model';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message])
  async getAllMessages(): Promise<Message[]> {
    return this.messageService.getAllMessages();
  }

  @Query(() => Message)
  async getMessageById(@Args('messageID', { type: () => Int }) messageID: number): Promise<Message> {
    return this.messageService.getMessageById(messageID);
  }

  @Query(() => [Message])
  async getAllMessagesByUserId(@Args('userID', { type: () => Int }) userID: number): Promise<Message[]> {
    return this.messageService.getAllMessagesByUserId(userID);
  }

  @Query(() => [Message])
  async getAllMessagesByConversationId(@Args('conversationID', { type: () => Int }) conversationID: number): Promise<Message[]> {
    return this.messageService.getAllMessagesByConversationId(conversationID);
  }
}