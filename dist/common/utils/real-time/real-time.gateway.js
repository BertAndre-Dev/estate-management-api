var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RealtimeGateway_1;
import { WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
let RealtimeGateway = RealtimeGateway_1 = class RealtimeGateway {
    server;
    logger = new Logger(RealtimeGateway_1.name);
    afterInit() {
        this.logger.log('Realtime Gateway Initialized');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    publishMeterReading(data) {
        this.server.emit('meter.reading', data);
    }
    publishDiagnostics(data) {
        this.server.emit('meter.diagnostics', data);
    }
    publishBalance(data) {
        this.server.emit('meter.balance', data);
    }
    publishEvent(event) {
        this.server.emit('meter.event', event);
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], RealtimeGateway.prototype, "server", void 0);
RealtimeGateway = RealtimeGateway_1 = __decorate([
    WebSocketGateway({
        cors: {
            origin: '*',
        },
    })
], RealtimeGateway);
export { RealtimeGateway };
//# sourceMappingURL=real-time.gateway.js.map