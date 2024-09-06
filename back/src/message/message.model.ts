import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { Conversation } from '../conversation/conversation.model';

@ObjectType() // Décorateur GraphQL
@Entity() // Décorateur TypeORM
export class Message {
  @Field(() => ID) // GraphQL type
  @PrimaryGeneratedColumn() // TypeORM primary key
  messageID: number;

  @Field() // GraphQL field
  @Column() // TypeORM column
  content: string;

  @Field(() => User) // GraphQL relation field
  @ManyToOne(() => User, user => user.userID)
  fromUser: User;

  @Field(() => Conversation) // GraphQL relation field
  @ManyToOne(() => Conversation, conversation => conversation.messages) // TypeORM relation
  @JoinColumn({ name: 'conversationID' }) // TypeORM join column
  conversation: Conversation;

  @Field() // GraphQL field
  @Column() // TypeORM column
  timestamp: string;
}
