import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class BullQueueService {
  constructor(@InjectQueue('my-queue') private readonly MyQueue: Queue) {}

  async addTranscodeJob(content: string) {
    await this.MyQueue.add('transcode', { content });
  } 
}
