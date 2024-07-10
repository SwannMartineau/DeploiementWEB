import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {
  private users: User[] = [
    { userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: "azerty" },
    { userID: 2, username: 'JaneSmith', email: 'JaneSmith@mail.com', password: "azerty" },
  ];
  private nextUserId = 3;

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(userID: number): User {
    return this.users.find(user => user.userID === userID);
  }

  getIdentityById(userID: number): string {
    const user = this.getUserById(userID);
    return user ? `${user.username}` : null;
  }

  async signUP(username: string, email: string, password: string): Promise<{token: string, user:User}> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      userID: this.nextUserId++,
      username,
      email,
      password: hashedPassword,
    };
    this.users.push(newUser);
    const token = jwt.sign({ userID: newUser.userID }, process.env.JWT_SECRET);
    return {"token" : token, "user": newUser};
  }

  async login(username: string, password: string): Promise<{token: string, user:User}> {
    const user = this.users.find(u => u.username === username);
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET);
    return {"token" : token, "user": user};
  }
}