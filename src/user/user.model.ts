import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  userID: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
