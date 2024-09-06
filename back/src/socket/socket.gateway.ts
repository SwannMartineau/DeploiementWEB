import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, ConnectedSocket, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.model';
import { Message } from 'src/message/message.model';

@WebSocketGateway({
  cors: {
    origin: '*', // Permet les connexions depuis n'importe quel domaine
  },
})
@Injectable()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('setSocketId')
  async handleSetSocketId(@MessageBody() userID: number, @ConnectedSocket() client: Socket) {
    const user = await this.userRepository.findOne({ where: { userID } });
    if (user) {
      user.socketID = client.id;
      await this.userRepository.save(user);
    }
  }

  // Méthode pour émettre un événement de nouveau message
  sendNewMessageNotification(message: Message) {
    const conversation = message.conversation;
    const sender = message.fromUser;
    //const dest = conversation.participants.find(x => x.userID != sender.userID);

    conversation.participants.forEach(user => {
      console.log(user);
      if (user.userID != sender.userID) {
        this.server.to(user.socketID).emit('sendNewMessageNotification', message);
      }
    });
    //this.server.to(dest.socketID).emit('sendNewMessageNotification', message);
  }

  sendUserConnect(ConnectedUser: User) {
    this.server.emit('sendUserConnect', ConnectedUser);
  }

  sendUserDisconnect(DisconnectedUser: User) {
    this.server.emit('sendUserDisconnect', DisconnectedUser);
  }
}
