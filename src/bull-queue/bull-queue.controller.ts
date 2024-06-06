import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Post } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('bull-queue')
export class BullQueueController {
  constructor(@InjectQueue('my-queue') private readonly MyQueue: Queue) {}

  @Get('transcode')
  async transcode() {
    await this.MyQueue.add('transcode', {
      content: 'This is a message',
    });
    return 'Job added to the queue';
  }
}