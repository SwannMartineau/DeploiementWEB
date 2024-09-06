import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType() // Décorateur pour GraphQL
@Entity() // Décorateur pour TypeORM
export class User {
  @Field(() => ID) // Déclare `userID` comme un champ de type ID pour GraphQL
  @PrimaryGeneratedColumn() // Déclare `userID` comme clé primaire pour TypeORM
  userID: number;

  @Field() // Déclare `username` comme un champ GraphQL
  @Column({ unique: true }) // Colonne unique dans la base de données
  username: string;

  @Field() // Déclare `email` comme un champ GraphQL
  @Column({ unique: true }) // Colonne unique dans la base de données
  email: string;

  // Le champ `password` n'est pas exposé dans GraphQL pour des raisons de sécurité
  @Column() 
  password: string;

  @Field({ nullable: true }) // Optionnel dans GraphQL, pour permettre la valeur nulle
  @Column({ nullable: true }) // Permet de stocker une valeur nulle dans la base de données
  socketID?: string; // Le point d'interrogation signifie que ce champ est optionnel
}
