import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [SocketGateway],
    exports: [SocketGateway]
})
export class SocketModule {}
