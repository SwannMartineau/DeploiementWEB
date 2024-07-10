import { Controller, Get } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';

@Controller('bull-queue')
export class BullQueueController {
  constructor(private readonly bullQueueService: BullQueueService) {}

  @Get('add-job')
  async addJob() {
    await this.bullQueueService.addTranscodeJob('This is a message');
    return 'Job added to the queue';
  }
}
