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
exports.PendingRequestSchema = exports.PendingRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const pending_request_enum_1 = require("../../common/enum/pending-request.enum");
let PendingRequest = class PendingRequest {
    messageId;
    noun;
    payload;
    status;
    correlationId;
    replyAddress;
};
exports.PendingRequest = PendingRequest;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], PendingRequest.prototype, "messageId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PendingRequest.prototype, "noun", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], PendingRequest.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: pending_request_enum_1.PendingRequstType.PENDING,
        default: pending_request_enum_1.PendingRequstType.PENDING,
    }),
    __metadata("design:type", String)
], PendingRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PendingRequest.prototype, "correlationId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PendingRequest.prototype, "replyAddress", void 0);
exports.PendingRequest = PendingRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PendingRequest);
exports.PendingRequestSchema = mongoose_1.SchemaFactory.createForClass(PendingRequest);
//# sourceMappingURL=pending-request.schema.js.map