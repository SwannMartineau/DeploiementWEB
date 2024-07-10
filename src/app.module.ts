import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { GraphqlModule } from './graphql/graphql.module';
import { DateTimeScalar } from './message/date.scalar';
import { BullMQModule } from './bull-queue/bull-queue.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [HealthModule, BullMQModule, GraphqlModule, MessageModule],
  controllers: [AppController],
  providers: [AppService, DateTimeScalar],
})
export class AppModule {}