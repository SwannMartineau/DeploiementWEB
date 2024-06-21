import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  private users: User[] = [
    { userID: 1, firstName: 'John', lastName: 'Doe' },
    { userID: 2, firstName: 'Jane', lastName: 'Smith' },
  ];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(userID: number): User {
    return this.users.find(user => user.userID === userID);
  }

  getIdentityById(userID: number): string {
    const user = this.getUserById(userID);
    return user ? `${user.firstName} ${user.lastName}` : null;
  }
}