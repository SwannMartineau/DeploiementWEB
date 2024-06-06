import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BullQueueProcessor } from './bull-queue.processor';
import { BullQueueController } from './bull-queue.controller';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'my-queue',
    }),
  ],
  controllers: [BullQueueController],
  providers: [BullQueueProcessor],
})
export class BullQueueModule {}
