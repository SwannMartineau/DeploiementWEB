import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { DateTimeScalar } from './date.scalar';


@Module({
  providers: [MessageService, MessageResolver, DateTimeScalar],
  exports: [MessageService],
})
export class MessageModule {}