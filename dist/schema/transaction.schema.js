var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["NOTPAID"] = "not-paid";
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (PaymentStatus = {}));
let Transaction = class Transaction {
    walletId;
    type;
    amount;
    paymentStatus;
    tx_ref;
    description;
};
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", String)
], Transaction.prototype, "walletId", void 0);
__decorate([
    Prop({
        required: true,
        enum: ['credit', 'debit']
    }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    Prop({
        enum: PaymentStatus,
        default: PaymentStatus.NOTPAID,
        required: true,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "paymentStatus", void 0);
__decorate([
    Prop({
        type: String,
        required: true,
        unique: true
    }),
    __metadata("design:type", String)
], Transaction.prototype, "tx_ref", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
Transaction = __decorate([
    Schema({
        timestamps: true
    })
], Transaction);
export { Transaction };
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
//# sourceMappingURL=transaction.schema.js.map