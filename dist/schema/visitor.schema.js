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
export class VisitorDetails {
    firstName;
    lastName;
    phone;
    purpose;
}
__decorate([
    Prop(),
    __metadata("design:type", String)
], VisitorDetails.prototype, "firstName", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], VisitorDetails.prototype, "lastName", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], VisitorDetails.prototype, "phone", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], VisitorDetails.prototype, "purpose", void 0);
const VisitorDetailsSchema = SchemaFactory.createForClass(VisitorDetails);
let Visitor = class Visitor {
    residentId;
    addressId;
    visitor;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], Visitor.prototype, "residentId", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Visitor.prototype, "addressId", void 0);
__decorate([
    Prop({
        type: [VisitorDetailsSchema],
        required: true,
        default: []
    }),
    __metadata("design:type", Array)
], Visitor.prototype, "visitor", void 0);
Visitor = __decorate([
    Schema({
        timestamps: true
    })
], Visitor);
export { Visitor };
export const VisitorSchema = SchemaFactory.createForClass(Visitor);
//# sourceMappingURL=visitor.schema.js.map