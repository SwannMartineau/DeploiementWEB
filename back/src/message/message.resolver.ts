import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './message.model';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversation/conversation.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async getAllMessages(): Promise<Message[]> {
    return this.messageService.getAllMessages();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Message)
  async getMessageById(@Args('messageID', { type: () => Int }) messageID: number): Promise<Message> {
    return this.messageService.getMessageById(messageID);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async getAllMessagesByUserId(@Args('userID', { type: () => Int }) userID: number): Promise<Message[]> {
    return this.messageService.getAllMessagesByUserId(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async getAllMessagesByConversationId(@Args('conversationID', { type: () => Int }) conversationID: number): Promise<Message[]> {
    return this.messageService.getAllMessagesByConversationId(conversationID);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message)
  async sendMessage(
    @Args('content') content: string,
    @Args('fromUserID', { type: () => Int }) fromUserId: number,
    @Args('conversationID', { type: () => Int }) conversationId: number,
  ): Promise<Message> {
    // Récupération de l'utilisateur depuis la base de données
    const fromUser = await this.userService.getUserById(fromUserId);
    if (!fromUser) {
      throw new Error('User not found');
    }

    // Récupération de la conversation depuis la base de données
    const conversation = await this.conversationService.getConversationById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Envoie du message via le service, après vérification des entités
    const newMessage = await this.messageService.sendMessage(content, fromUser, conversation);
    
    // Optionnel : Ajouter le message à une queue pour un traitement asynchrone
    //await this.messageService.addMessageJob(content, fromUserId, conversationId);

    return newMessage;
  }
}
