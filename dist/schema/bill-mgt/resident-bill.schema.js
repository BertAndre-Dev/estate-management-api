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
exports.ResidentBillSchema = exports.ResidentBill = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ResidentBill = class ResidentBill {
    userId;
    billId;
    frequency;
    amountPaid;
    startDate;
    lastPaymentDate;
    nextDueDate;
    status;
};
exports.ResidentBill = ResidentBill;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ResidentBill.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ResidentBill.prototype, "billId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ResidentBill.prototype, "frequency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ResidentBill.prototype, "amountPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ResidentBill.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ResidentBill.prototype, "lastPaymentDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ResidentBill.prototype, "nextDueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'active' }),
    __metadata("design:type", String)
], ResidentBill.prototype, "status", void 0);
exports.ResidentBill = ResidentBill = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true
    })
], ResidentBill);
exports.ResidentBillSchema = mongoose_1.SchemaFactory.createForClass(ResidentBill);
//# sourceMappingURL=resident-bill.schema.js.map