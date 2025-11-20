import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger(RealtimeGateway.name);

  afterInit() {
    this.logger.log('Realtime Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // 🔥 Emit new readings to clients
  publishMeterReading(data: any) {
    this.server.emit('meter.reading', data);
  }

  // 🔥 Emit diagnostics (voltage, current, power factor)
  publishDiagnostics(data: any) {
    this.server.emit('meter.diagnostics', data);
  }

  // 🔥 Emit balance / credit updates
  publishBalance(data: any) {
    this.server.emit('meter.balance', data);
  }

  // 🔥 Emit events (token used, overload, phase failure)
  publishEvent(event: any) {
    this.server.emit('meter.event', event);
  }
}
