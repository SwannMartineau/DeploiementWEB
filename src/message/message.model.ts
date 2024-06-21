import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: number;

  @Field()
  from_user_id: number;

  @Field()
  to_user_id: number;

  @Field()
  content: string;

  @Field(() => String)
  timestamp: string;
}
