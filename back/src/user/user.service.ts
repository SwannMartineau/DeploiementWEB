import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(userID: number): Promise<User> {
    return this.userRepository.findOne({ where: { userID } });
  }

  async getIdentityById(userID: number): Promise<string | null> {
    const user = await this.getUserById(userID);
    return user ? `${user.username}` : null;
  }

  async signUP(username: string, email: string, password: string): Promise<{ token: string, user: User }> {
    // Vérifier si le username est déjà utilisé
    const existingUserByUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUserByUsername) {
      throw new Error('Username already taken');
    }

    // Vérifier si l'email est déjà utilisé
    const existingUserByEmail = await this.userRepository.findOne({ where: { email } });
    if (existingUserByEmail) {
      throw new Error('Email already in use');
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    const token = jwt.sign({ userID: newUser.userID }, process.env.JWT_SECRET);
    return { token, user: newUser };
  }

  async login(username: string, password: string): Promise<{ token: string, user: User }> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET);

    return { token, user };
  }
}