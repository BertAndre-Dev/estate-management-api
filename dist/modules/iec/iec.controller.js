"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IecController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const iec_client_service_1 = require("./iec-client.service");
const get_meter_readings_dto_1 = require("../../dto/iec-dto/get-meter-readings.dto");
const disconnect_meter_dto_1 = require("../../dto/iec-dto/disconnect-meter.dto");
const reconnect_meter_dto_1 = require("../../dto/iec-dto/reconnect-meter.dto");
const history_data_dto_1 = require("../../dto/iec-dto/history-data.dto");
const details_meter_dto_1 = require("../../dto/iec-dto/details-meter.dto");
let IecController = class IecController {
    iecClient;
    constructor(iecClient) {
        this.iecClient = iecClient;
    }
    async debugToken() {
        return { message: 'Token is handled internally now' };
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
};
exports.IecController = IecController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get HES authentication token (for debugging only)' }),
    (0, common_1.Post)('auth/token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IecController.prototype, "debugToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Read real-time meter data (OBIS reading)' }),
    (0, common_1.Post)('meter/readings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_meter_readings_dto_1.GetMeterReadingsDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "getMeterReadings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Disconnect supply (relay open)' }),
    (0, common_1.Post)('meter/disconnect'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disconnect_meter_dto_1.DisconnectMeterDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "disconnect", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reconnect supply (relay close)' }),
    (0, common_1.Post)('meter/reconnect'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reconnect_meter_dto_1.ReconnectMeterDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "reconnect", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get historical meter data (load profile)' }),
    (0, common_1.Post)('meter/history'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [history_data_dto_1.HistoryDataDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "history", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List or discover available meters' }),
    (0, common_1.Post)('meter/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IecController.prototype, "listMeters", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed meter metadata' }),
    (0, common_1.Post)('meter/details'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [details_meter_dto_1.DetailsMeterDto]),
    __metadata("design:returntype", Promise)
], IecController.prototype, "details", null);
exports.IecController = IecController = __decorate([
    (0, swagger_1.ApiTags)('IEC Smart Metering'),
    (0, common_1.Controller)('iec'),
    __metadata("design:paramtypes", [iec_client_service_1.IecClientService])
], IecController);
//# sourceMappingURL=iec.controller.js.map