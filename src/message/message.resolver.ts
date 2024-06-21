import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './message.model';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message])
  async getAllUsers(): Promise<Message[]> {
    return this.messageService.getAllMessages();
  }

  @Query(() => Message)
  async getUserById(@Args('id', { type: () => Int }) id: number): Promise<Message> {
    return this.messageService.getMessageById(id);
  }
}