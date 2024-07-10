import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversation/conversation.service';

@Processor('message-queue')
export class MessageProcessor extends WorkerHost {
  private readonly logger = new Logger(MessageProcessor.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug('Processing message job...');
    const { content, fromUserId, conversationId } = job.data;
    const fromUser = await this.userService.getUserById(fromUserId);
    const conversation = await this.conversationService.getConversationById(conversationId);

    if (fromUser && conversation) {
      await this.messageService.sendUserMessage(content, fromUser, conversation);
      this.logger.debug('Message saved successfully');
    } else {
      this.logger.error('User or conversation not found');
    }
  }
}
