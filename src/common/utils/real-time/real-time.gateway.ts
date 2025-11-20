// src/realtime/realtime.gateway.ts
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
  cors: { origin: '*' },
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  afterInit() {
    this.logger.log('⚡ Realtime Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`🟢 Client connected → ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔴 Client disconnected → ${client.id}`);
  }

  // ===========================================
  // 🔥 REALTIME METER READING (energy, power…)
  // ===========================================
  publishMeterReading(data: {
    meterNumber: string;
    energy?: number;
    instantaneousPower?: number;
    voltageL1?: number;
    voltageL2?: number;
    voltageL3?: number;
    currentL1?: number;
    currentL2?: number;
    currentL3?: number;
    timestamp?: string | Date;
  }) {
    this.server.emit('meter.reading', {
      ...data,
      timestamp: data.timestamp || new Date(),
    });
  }

  // ===========================================
  // ⚡ REALTIME BALANCE / CREDIT
  // ===========================================
  publishBalance(data: {
    meterNumber: string;
    balance: number;
    used?: number;
    lastTokenAmount?: number;
    timestamp?: string | Date;
  }) {
    this.server.emit('meter.balance', {
      ...data,
      timestamp: data.timestamp || new Date(),
    });
  }

  // ===========================================
  // 🔍 Diagnostics (Voltage, Current, PF)
  // ===========================================
  publishDiagnostics(data: {
    meterNumber: string;
    voltageL1?: number;
    voltageL2?: number;
    voltageL3?: number;
    currentL1?: number;
    currentL2?: number;
    currentL3?: number;
    powerFactor?: number;
    timestamp?: string | Date;
  }) {
    this.server.emit('meter.diagnostics', {
      ...data,
      timestamp: data.timestamp || new Date(),
    });
  }

  // ===========================================
  // 🚨 Meter Events (token used, overload…)
  // ===========================================
  publishEvent(event: {
    meterNumber: string;
    type: string;
    description?: string;
    timestamp?: string | Date;
    raw?: any;
  }) {
    this.server.emit('meter.event', {
      ...event,
      timestamp: event.timestamp || new Date(),
    });
  }
}
