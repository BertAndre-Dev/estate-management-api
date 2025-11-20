var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
let MeterReading = class MeterReading {
    meterNumber;
    obis;
    value;
    timestamp;
    name;
    category;
    unit;
    source;
    raw;
    transId;
    receivedToken;
    amount;
    parsed;
    phase;
    voltage;
    current;
    powerFactor;
    activePower;
    reactivePower;
    energyImport;
    energyExport;
    consumption;
    balanceKwh;
    lowBalanceAlert;
    overloadAlert;
    phaseFailureAlert;
    voltageSagAlert;
    voltageSwellAlert;
    eventType;
};
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], MeterReading.prototype, "meterNumber", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "obis", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "value", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], MeterReading.prototype, "timestamp", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "name", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "category", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "unit", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "source", void 0);
__decorate([
    Prop({ type: Object }),
    __metadata("design:type", Object)
], MeterReading.prototype, "raw", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "transId", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "receivedToken", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "amount", void 0);
__decorate([
    Prop({ type: Object }),
    __metadata("design:type", Object)
], MeterReading.prototype, "parsed", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "phase", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "voltage", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "current", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "powerFactor", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "activePower", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "reactivePower", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "energyImport", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "energyExport", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "consumption", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], MeterReading.prototype, "balanceKwh", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], MeterReading.prototype, "lowBalanceAlert", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], MeterReading.prototype, "overloadAlert", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], MeterReading.prototype, "phaseFailureAlert", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], MeterReading.prototype, "voltageSagAlert", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], MeterReading.prototype, "voltageSwellAlert", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], MeterReading.prototype, "eventType", void 0);
MeterReading = __decorate([
    Schema({ timestamps: true })
], MeterReading);
export { MeterReading };
export const MeterReadingSchema = SchemaFactory.createForClass(MeterReading);
//# sourceMappingURL=meter-reading.schema.js.map