import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/conversation.model';
import { Message } from 'src/message/message.model';
import { User } from 'src/user/user.model';

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'user',
        password: 'tcheat',
        database: 'tcheat',
        entities: [User, Message, Conversation],
        synchronize: true,
      }),
    ],
  })
  export class dbModule {}