import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('my-queue')
export class BullQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(BullQueueProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
    }
  }
}
