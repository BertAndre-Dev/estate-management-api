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
let Field = class Field {
    estateId;
    label;
    key;
    isActive;
};
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", String)
], Field.prototype, "estateId", void 0);
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", String)
], Field.prototype, "label", void 0);
__decorate([
    Prop({
        required: true
    }),
    __metadata("design:type", String)
], Field.prototype, "key", void 0);
__decorate([
    Prop({
        default: true
    }),
    __metadata("design:type", Boolean)
], Field.prototype, "isActive", void 0);
Field = __decorate([
    Schema({
        timestamps: true
    })
], Field);
export { Field };
export const FieldSchema = SchemaFactory.createForClass(Field);
//# sourceMappingURL=field.schema.js.map