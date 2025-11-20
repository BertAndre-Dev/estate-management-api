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
exports.BillPaymentSchema = exports.BillPayment = exports.PaymentStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["NOTPAID"] = "not-paid";
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let BillPayment = class BillPayment {
    billId;
    userId;
    transactionId;
    frequency;
    amountPaid;
    paymentStatus;
    nextDueDate;
};
exports.BillPayment = BillPayment;
__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    __metadata("design:type", String)
], BillPayment.prototype, "billId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    __metadata("design:type", String)
], BillPayment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    __metadata("design:type", String)
], BillPayment.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['monthly', 'quarterly', 'yearly'], required: true }),
    __metadata("design:type", String)
], BillPayment.prototype, "frequency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BillPayment.prototype, "amountPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    }),
    __metadata("design:type", String)
], BillPayment.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date
    }),
    __metadata("design:type", Date)
], BillPayment.prototype, "nextDueDate", void 0);
exports.BillPayment = BillPayment = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true
    })
], BillPayment);
exports.BillPaymentSchema = mongoose_1.SchemaFactory.createForClass(BillPayment);
//# sourceMappingURL=bill-payment.schema.js.map