var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class HistoryDataDto {
    meterNumber;
    dTypeID;
    start;
    end;
}
__decorate([
    ApiProperty({ example: '00123456789', description: 'Meter number (mRID)' }),
    IsString(),
    __metadata("design:type", String)
], HistoryDataDto.prototype, "meterNumber", void 0);
__decorate([
    ApiProperty({ example: '1.8.0', description: 'History OBIS TypeId (dTypeID)' }),
    IsString(),
    __metadata("design:type", String)
], HistoryDataDto.prototype, "dTypeID", void 0);
__decorate([
    ApiProperty({ example: '2024-01-01 00:00:00', description: 'Start date (yyyy-MM-dd HH:mm:ss)' }),
    IsString(),
    __metadata("design:type", String)
], HistoryDataDto.prototype, "start", void 0);
__decorate([
    ApiProperty({ example: '2024-01-02 00:00:00', description: 'End date (yyyy-MM-dd HH:mm:ss)' }),
    IsString(),
    __metadata("design:type", String)
], HistoryDataDto.prototype, "end", void 0);
//# sourceMappingURL=history-data.dto.js.map