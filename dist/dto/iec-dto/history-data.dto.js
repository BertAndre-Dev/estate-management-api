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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class HistoryDataDto {
    meterNumber;
    dTypeID;
    start;
    end;
}
exports.HistoryDataDto = HistoryDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '00123456789', description: 'Meter number (mRID)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HistoryDataDto.prototype, "meterNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1.8.0', description: 'History OBIS TypeId (dTypeID)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HistoryDataDto.prototype, "dTypeID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01 00:00:00', description: 'Start date (yyyy-MM-dd HH:mm:ss)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HistoryDataDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-02 00:00:00', description: 'End date (yyyy-MM-dd HH:mm:ss)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HistoryDataDto.prototype, "end", void 0);
//# sourceMappingURL=history-data.dto.js.map