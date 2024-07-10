import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Conversation } from '../conversation/conversation.model';
import { User } from '../user/user.model';

@ObjectType()
export class Message {
  @Field(() => ID)
  messageID: number;

  @Field()
  content: string;

  @Field(() => User)
  fromUser: User;

  @Field(() => Conversation)
  conversation: Conversation;

  @Field()
  timestamp: string;
}
