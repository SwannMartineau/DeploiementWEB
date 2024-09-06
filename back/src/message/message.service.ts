import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import { User } from '../user/user.model';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectQueue('message-queue') private readonly messageQueue: Queue,
    private readonly socketGateway: SocketGateway,
  ) {}

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({ relations: ['fromUser', 'conversation'] });
  }

  async getMessageById(id: number): Promise<Message> {
    return this.messageRepository.findOne({
      where: { messageID: id },
      relations: ['fromUser', 'conversation'],
    });
  }

  async getAllMessagesByUserId(userID: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { fromUser: { userID } },
      relations: ['conversation'],
    });
  }

  async getAllMessagesByConversationId(conversationID: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversation: { conversationID } },
      relations: ['fromUser', 'conversation'],
      order: { timestamp: 'ASC' },
    });
  }

  async sendMessage(content: string, fromUser: User, conversation: Conversation): Promise<Message> {
    const newMessage = this.messageRepository.create({
      content,
      fromUser,
      conversation,
      timestamp: new Date().toISOString(),
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    // Ajouter le message dans la conversation (facultatif si la relation est déjà établie via TypeORM)
    conversation.messages.push(newMessage);
    await this.conversationRepository.save(conversation);
    this.socketGateway.sendNewMessageNotification(savedMessage);
    return newMessage;
  }

  async addMessageJob(content: string, fromUserId: number, conversationId: number): Promise<any> {
    return await this.messageQueue.add('save-message', {
      content,
      fromUserId,
      conversationId,
    });
  }
}
