import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    console.log("enter0");
    return this.userService.getAllUsers();
  }

  @Query(() => User)
  async getUserById(@Args('userID', { type: () => Int }) userID: number): Promise<User> {
    return this.userService.getUserById(userID);
  }

  @Query(() => String)
  async getIdentityById(@Args('userID', { type: () => Int }) userID: number): Promise<string> {
    return this.userService.getIdentityById(userID);
  }
}