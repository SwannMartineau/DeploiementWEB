import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullQueueController } from './bull-queue.controller';
import { BullQueueService } from './bull-queue.service';
import { BullQueueProcessor } from './bull-queue.processor';


@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
        name: 'my-queue',
    }),
  ],
  controllers: [BullQueueController],
  providers: [BullQueueService, BullQueueProcessor],
})
export class BullMQModule {}