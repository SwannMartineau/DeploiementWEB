import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from './user.model';

// Mock de bcrypt pour simuler le comportement de hash et compare
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock de jwt.sign pour simuler la création de token JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('signUP', () => {
    it('Creer un user et retourne un token et un user', async () => {
      const newUser = await service.signUP('NewUser', 'newuser@mail.com', 'hashedPassword');
      expect(newUser).toEqual({
        token: 'mockedToken',
        user: { userID: 1, username: 'NewUser', email: 'newuser@mail.com', password: 'hashedPassword' },
      });
    });
  });

  it('Crée deux utilisateurs successivement', async () => {
    const user1 = await service.signUP('JohnDoe', 'JohnDoe@mail.com', 'hashedPassword');
    const user2 = await service.signUP('JaneSmith', 'JaneSmith@mail.com', 'hashedPassword');

    expect(user1).toEqual({
      token: 'mockedToken',
      user: { userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: 'hashedPassword' },
    });

    expect(user2).toEqual({
      token: 'mockedToken',
      user: { userID: 2, username: 'JaneSmith', email: 'JaneSmith@mail.com', password: 'hashedPassword' },
    });

    // Vérifier que les utilisateurs sont bien enregistrés dans UserService
    const allUsers = service.getAllUsers();
    expect(allUsers).toEqual([
      { userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: 'hashedPassword' },
      { userID: 2, username: 'JaneSmith', email: 'JaneSmith@mail.com', password: 'hashedPassword' },
    ]);
  });

  describe('getAllUsers', () => {
    it('Retourne un array de tous les utilisateurs', async() => {
      await service.signUP('JohnDoe', 'JohnDoe@mail.com', 'hashedPassword');
      await service.signUP('JaneSmith', 'JaneSmith@mail.com', 'hashedPassword');
      const users = service.getAllUsers();
      expect(users).toEqual([
        { userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: 'hashedPassword' },
        { userID: 2, username: 'JaneSmith', email: 'JaneSmith@mail.com', password: 'hashedPassword' },
      ]);
    });
  });

  describe('getUserById', () => {
    it('Retourne un utilisateur grace a son id', async() => {
      await service.signUP('JohnDoe', 'JohnDoe@mail.com', 'hashedPassword');
      const user = service.getUserById(1);
      expect(user).toEqual({ userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: 'hashedPassword' });
    });

    it('Retourne undefined si utilisateur non trouvé', () => {
      const user = service.getUserById(999);
      expect(user).toBeUndefined();
    });
  });

  describe('login', () => {
    it('Retourne le token et un user si tout est valide', async () => {
      await service.signUP('JohnDoe', 'JohnDoe@mail.com', 'hashedPassword');
      const loggedInUser = await service.login('JohnDoe', 'password');
      expect(loggedInUser).toEqual({
        token: 'mockedToken',
        user: { userID: 1, username: 'JohnDoe', email: 'JohnDoe@mail.com', password: 'hashedPassword' },
      });
    });

    it('Retourne une erreur avec un mauvais mot de passe', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('JohnDoe', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('Retourne une erreur avec un mauvais username', async () => {
      await expect(service.login('NonExistingUser', 'password')).rejects.toThrow('Invalid credentials');
    });
  });
});
