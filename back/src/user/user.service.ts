import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Conversation } from 'src/conversation/conversation.model';
import { SocketGateway } from 'src/socket/socket.gateway';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    private readonly socketGateway: SocketGateway
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
      isConnected: true,
    });
    await this.userRepository.save(newUser);

    const global_conv = await this.conversationRepository
    .createQueryBuilder('conversation')
    .leftJoinAndSelect('conversation.participants', 'participant') // Inclut les participants
    .leftJoinAndSelect('conversation.messages', 'messages') // Inclut les messages
    .where('conversation.isGlobal = :isGlobal', { isGlobal: true }) // Filtre pour récupérer les conversations globales
    .getOne();

    if (global_conv) {
      global_conv.participants.push(newUser);
      await this.conversationRepository.save(global_conv);
    } else {
      const newConversation = this.conversationRepository.create({
        participants: [newUser],
        messages: [],
        isGlobal: true
      });
      this.conversationRepository.save(newConversation);
    }
    const token = jwt.sign({ userID: newUser.userID }, process.env.JWT_SECRET);
    this.socketGateway.sendUserConnect(newUser);
    return { token, user: newUser };
  }

  async login(username: string, password: string): Promise<{ token: string, user: User }> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    user.isConnected = true;
    await this.userRepository.save(user);
    const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET);
    this.socketGateway.sendUserConnect(user);
    return { token, user };
  }

  async logout(userID: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { userID } });
    if (!user) {
      throw new Error('Invalid userID');
    }
    user.isConnected = false;
    await this.userRepository.save(user);
    this.socketGateway.sendUserDisconnect(user);
    return "the user disconnect succesfully"
  }
}