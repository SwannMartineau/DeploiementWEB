import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { User } from '../user/user.model';
import { Conversation } from './conversation.model';

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationService],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  describe('getAllConversations', () => {
    it('Return un array de toutes les conversations', () => {
      const result: Conversation[] = [];
      expect(service.getAllConversations()).toEqual(result);
    });
  });


  describe('createConversation', () => {
    it('should create a new conversation', () => {
      const user1: User = { userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: 'hashedpassword1' };
      const user2: User = { userID: 2, username: 'JaneSmith', email: 'JaneSmith@mail.com', password: 'hashedpassword2' };
      const newConversation = service.createConversation(user1, user2);
      expect(newConversation).toBeDefined();
      expect(newConversation.conversationID).toBe(1);
      expect(newConversation.participants).toEqual([user1, user2]);
      expect(service.getAllConversations()).toContain(newConversation);
    });
  });

  describe('getConversationById', () => {
    it('Retourne une conversation avec id une conversation', () => {
      const user1: User = { userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: 'hashedpassword1' };
      const user2: User = { userID: 2, username: 'JaneSmith', email: 'JaneSmith@mail.com', password: 'hashedpassword2' };
      const newConversation = service.createConversation(user1, user2);
      expect(service.getConversationById(newConversation.conversationID)).toEqual(newConversation);
    });

    it('Return undefined si aucune conversation', () => {
      expect(service.getConversationById(999)).toBeUndefined();
    });
  });

  describe('getAllConversationsByParticipantId', () => {
    it('Return un array des conversations avec les ids des users', () => {
      const user1: User = { userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: 'hashedpassword1' };
      const user2: User = { userID: 2, username: 'JaneSmith', email: 'JaneSmith@mail.com', password: 'hashedpassword2' };
      const newConversation = service.createConversation(user1, user2);
      const result = [newConversation];
      expect(service.getAllConversationsByParticipantId(user1.userID)).toEqual(result);
    });

    it('Return un array vide si aucune conversation est la', () => {
      expect(service.getAllConversationsByParticipantId(999)).toEqual([]);
    });
  });
});
