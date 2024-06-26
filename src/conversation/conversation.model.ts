import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from '../message/message.model';
import { User } from '../user/user.model';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  conversationID: number;

  @Field(() => [User])
  participants: User[];

  @Field(() => [Message])
  messages: Message[];
}
