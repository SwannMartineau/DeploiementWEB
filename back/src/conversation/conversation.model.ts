import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../user/user.model';
import { Message } from '../message/message.model';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType() // Décorateur pour GraphQL
@Entity() // Décorateur pour TypeORM
export class Conversation {
  @Field(() => ID) // Expose `conversationID` comme un champ de type ID pour GraphQL
  @PrimaryGeneratedColumn() // Déclare `conversationID` comme clé primaire pour TypeORM
  conversationID: number;

  @Field(() => [User]) // Expose `participants` comme un champ GraphQL de type liste de `User`
  @ManyToMany(() => User) // Relation ManyToMany entre `Conversation` et `User`
  @JoinTable() // Indique à TypeORM d'utiliser une table de jointure pour cette relation
  participants: User[];

  @Field(() => [Message]) // Expose `messages` comme un champ GraphQL de type liste de `Message`
  @OneToMany(() => Message, message => message.conversation) // Relation OneToMany entre `Conversation` et `Message`
  messages: Message[];
}
