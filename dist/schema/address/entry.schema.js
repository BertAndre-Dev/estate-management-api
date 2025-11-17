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
exports.EntrySchema = exports.Entry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Entry = class Entry {
    estateId;
    fieldId;
    data;
};
exports.Entry = Entry;
__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    __metadata("design:type", String)
], Entry.prototype, "estateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    __metadata("design:type", String)
], Entry.prototype, "fieldId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Map,
        of: mongoose_2.SchemaTypes.Mixed
    }),
    __metadata("design:type", Map)
], Entry.prototype, "data", void 0);
exports.Entry = Entry = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true
    })
], Entry);
exports.EntrySchema = mongoose_1.SchemaFactory.createForClass(Entry);
//# sourceMappingURL=entry.schema.js.map