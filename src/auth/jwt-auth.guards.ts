import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private usersService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request = ctx.req; // Accède à la requête HTTP via le contexte GraphQL
    const token = request.headers.authorization?.split(' ')[1] || '';
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const userId = jwt.verify(token, process.env.JWT_SECRET) as { userID: number };
      const user = await this.usersService.getUserById(userId.userID);
      if (user) {
        console.log(`User found: ${user.username} (${user.userID})`);
        request.user = user;
        return true;
      } else {
        throw new UnauthorizedException('User not found');
      }
    } catch (e) {
      console.error('Invalid token:', e.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
