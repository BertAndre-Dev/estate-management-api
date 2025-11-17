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
exports.MeterSchema = exports.Meter = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Meter = class Meter {
    meterNumber;
    mRID;
    userId;
    refName;
    refCode;
    isActive;
    isAssigned;
    estateId;
    addressId;
    lastCredit;
    lastSeen;
    model;
    vendorData;
};
exports.Meter = Meter;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Meter.prototype, "meterNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Meter.prototype, "mRID", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Meter.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Meter.prototype, "refName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Meter.prototype, "refCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: true
    }),
    __metadata("design:type", Boolean)
], Meter.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: false
    }),
    __metadata("design:type", Boolean)
], Meter.prototype, "isAssigned", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Meter.prototype, "estateId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Meter.prototype, "addressId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 0
    }),
    __metadata("design:type", Number)
], Meter.prototype, "lastCredit", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Meter.prototype, "lastSeen", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Meter.prototype, "model", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Meter.prototype, "vendorData", void 0);
exports.Meter = Meter = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Meter);
exports.MeterSchema = mongoose_1.SchemaFactory.createForClass(Meter);
//# sourceMappingURL=meter.schema.js.map