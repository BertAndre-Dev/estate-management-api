import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
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
    }): void;
    publishBalance(data: {
        meterNumber: string;
        balance: number;
        used?: number;
        lastTokenAmount?: number;
        timestamp?: string | Date;
    }): void;
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
    }): void;
    publishEvent(event: {
        meterNumber: string;
        type: string;
        description?: string;
        timestamp?: string | Date;
        raw?: any;
    }): void;
}
