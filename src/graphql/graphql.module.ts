import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserResolver } from 'src/user/user.resolver';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';
import { MessageResolver } from 'src/message/message.resolver';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
          sortSchema: true,
        }),
        UserModule,
        MessageModule,
      ],
  providers: [UserResolver, MessageResolver],
})
export class GraphqlModule {}
