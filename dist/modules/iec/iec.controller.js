var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IecClientService } from './iec-client.service';
import { GetMeterReadingsDto } from '../../dto/iec-dto/get-meter-readings.dto';
import { DisconnectMeterDto } from '../../dto/iec-dto/disconnect-meter.dto';
import { ReconnectMeterDto } from '../../dto/iec-dto/reconnect-meter.dto';
import { HistoryDataDto } from '../../dto/iec-dto/history-data.dto';
import { DetailsMeterDto } from '../../dto/iec-dto/details-meter.dto';
import { SendTokenDto } from "../../dto/iec-dto/send-token.dto";
let IecController = class IecController {
    iecClient;
    constructor(iecClient) {
        this.iecClient = iecClient;
    }
    async getMeterReadings(dto) {
        return this.iecClient.getMeterReadings(dto.meterNumber, dto.obis);
    }
    async disconnect(dto) {
        return this.iecClient.disconnectMeter(dto.meterNumber);
    }
    async reconnect(dto) {
        return this.iecClient.reconnectMeter(dto.meterNumber);
    }
    async history(dto) {
        return this.iecClient.getHistoryData(dto.meterNumber, dto.dTypeID, dto.start, dto.end);
    }
    async listMeters() {
        return this.iecClient.pageMeters();
    }
    async details(dto) {
        return this.iecClient.detailsMeter(dto.meterNumber);
    }
    async sendToken(dto) {
        return this.iecClient.sendToken(dto.meterNumber, dto.token);
    }
};
__decorate([
    ApiOperation({ summary: 'Read real-time meter data (OBIS reading)' }),
    Post('meter/readings'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetMeterReadingsDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "getMeterReadings", null);
__decorate([
    ApiOperation({ summary: 'Disconnect supply (relay open)' }),
    Post('meter/disconnect'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DisconnectMeterDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "disconnect", null);
__decorate([
    ApiOperation({ summary: 'Reconnect supply (relay close)' }),
    Post('meter/reconnect'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReconnectMeterDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "reconnect", null);
__decorate([
    ApiOperation({ summary: 'Get historical meter data (load profile)' }),
    Post('meter/history'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HistoryDataDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "history", null);
__decorate([
    ApiOperation({ summary: 'List or discover available meters' }),
    Post('meter/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IecController.prototype, "listMeters", null);
__decorate([
    ApiOperation({ summary: 'Get detailed meter metadata' }),
    Post('meter/details'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DetailsMeterDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "details", null);
__decorate([
    ApiOperation({ summary: 'Send STS Token to smart meter (via HES)' }),
    Post('meter/send-token'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendTokenDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "sendToken", null);
IecController = __decorate([
    ApiTags('IEC Smart Metering'),
    Controller('iec'),
    __metadata("design:paramtypes", [IecClientService])
], IecController);
export { IecController };
//# sourceMappingURL=iec.controller.js.map