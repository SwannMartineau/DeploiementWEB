import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  userID: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
