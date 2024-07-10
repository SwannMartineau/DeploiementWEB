import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/conversation.model';
import { Message } from 'src/message/message.model';
import { User } from 'src/user/user.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPE_ORM_HOST,
      port: Number.parseInt(process.env.TYPE_ORM_PORT),
      username: process.env.TYPE_ORM_USER,
      password: process.env.TYPE_ORM_PASSWORD,
      database: 'tcheat',
      entities: [User, Message, Conversation],
      synchronize: true,
    }),
  ],
})
export class dbModule {}