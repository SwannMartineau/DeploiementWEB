import { Injectable } from '@nestjs/common';
import { User } from '../user/user.model';
import { Message } from './message.model';


@Injectable()
export class MessageService {
  private messages: Message[] = [
    { id: 1, from_user_id: 1, to_user_id: 2, content:'this is a test'/* , timestamp: new Date('2023-01-01T00:00:00Z') */ },
    { id: 2, from_user_id: 2, to_user_id: 1, content:'this is a test reply'/* , timestamp: new Date('2023-01-01T00:00:00Z') */ },
  ];

  getAllMessages(): Message[] {
    return this.messages;
  }

  getMessageById(id: number): Message {
    return this.messages.find(message => message.id === id);
  }
}