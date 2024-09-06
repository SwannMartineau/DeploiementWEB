import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.model';
import { User } from '../user/user.model';
import { Message } from 'src/message/message.model';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

  ) {}

  async getAllConversations(): Promise<Conversation[]> {
    return this.conversationRepository.find({ relations: ['participants', 'messages'] });
  }

  async getConversationById(conversationID: number): Promise<Conversation> {
    return this.conversationRepository.findOne({
      where: { conversationID },
      relations: ['participants', 'messages'],
    });
  }

  async getAllConversationsByParticipantId(participantId: number): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant') // Récupère tous les participants de la conversation
      .leftJoinAndSelect('conversation.messages', 'messages') // Récupère les messages associés
      .where(qb => {
        const subQuery = qb.subQuery()
          .select('conversation.conversationID')
          .from('conversation', 'conversation')
          .leftJoin('conversation.participants', 'p')
          .where('p.userID = :participantId')
          .getQuery();
        return 'conversation.conversationID IN ' + subQuery;
      })
      .setParameter('participantId', participantId)
      .getMany();
  }

  async createConversation(user1: User, user2: User): Promise<Conversation> {
    
    if (user1.userID === user2.userID) {
      throw new Error('Users must be different');
    }
    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'participant')
      .where(
        '(participant.userID = :user1ID OR participant.userID = :user2ID)',
        { user1ID: user1.userID, user2ID: user2.userID },
      )
      .groupBy('conversation.conversationID')
      .having('COUNT(DISTINCT participant.userID) = 2') // Assure que les deux utilisateurs sont présents dans la même conversation
      .getOne();

    if (existingConversation) {
      const conversationID = existingConversation.conversationID;
      return this.conversationRepository.findOne({
      where: { conversationID },
      relations: ['participants', 'messages'],
    });
    }

    const newConversation = this.conversationRepository.create({
      participants: [user1, user2],
      messages: [],
    });

    return this.conversationRepository.save(newConversation);
  }

  async deleteConversationById(conversationID: number): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({
      where: { conversationID },
      relations: ['messages'],
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    await this.messageRepository.delete({ conversation: { conversationID } });

    await this.conversationRepository.delete(conversationID);

    return true;
  }
}
