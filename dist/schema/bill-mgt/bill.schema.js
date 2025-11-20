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
let Bill = class Bill {
    estateId;
    name;
    description;
    yearlyAmount;
    isActive;
    isServiceCharge;
};
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", String)
], Bill.prototype, "estateId", void 0);
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", String)
], Bill.prototype, "name", void 0);
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", String)
], Bill.prototype, "description", void 0);
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", Number)
], Bill.prototype, "yearlyAmount", void 0);
__decorate([
    Prop({
        default: true
    }),
    __metadata("design:type", Boolean)
], Bill.prototype, "isActive", void 0);
__decorate([
    Prop({
        default: true
    }),
    __metadata("design:type", Boolean)
], Bill.prototype, "isServiceCharge", void 0);
Bill = __decorate([
    Schema({
        timestamps: true
    })
], Bill);
export { Bill };
export const BillSchema = SchemaFactory.createForClass(Bill);
//# sourceMappingURL=bill.schema.js.map