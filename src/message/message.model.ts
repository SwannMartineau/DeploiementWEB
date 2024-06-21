import { Field, ObjectType, ID } from '@nestjs/graphql';
/* import { DateTimeScalar } from './date.scalar';
 */
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

  /* @Field(() => DateTimeScalar)
  timestamp: Date; */
}
