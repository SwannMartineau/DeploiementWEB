import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { UseGuards } from '@nestjs/common';
import { SignUpResponse } from './sign-up-response.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async getUserById(@Args('userID', { type: () => Int }) userID: number): Promise<User> {
    return this.userService.getUserById(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => String)
  async getIdentityById(@Args('userID', { type: () => Int }) userID: number): Promise<string> {
    return this.userService.getIdentityById(userID);
  }

  @Mutation(() => SignUpResponse)
  async signUP(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<SignUpResponse> {
    return this.userService.signUP(username, email, password);
  }

  @Mutation(() => SignUpResponse)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<SignUpResponse> {
    return this.userService.login(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  async logout(@Args('userID', { type: () => Int }) userID: number): Promise<string> {
    return this.userService.logout(userID);
  }
}