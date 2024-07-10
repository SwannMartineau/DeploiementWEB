import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { GraphqlModule } from './graphql/graphql.module';
import { DateTimeScalar } from './message/date.scalar';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { dbModule } from './db/db.module';

@Module({
  imports: [HealthModule, GraphqlModule, MessageModule, AuthModule, dbModule],
  controllers: [AppController],
  providers: [AppService, DateTimeScalar],
})
export class AppModule {}