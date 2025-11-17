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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VendingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const signature_utils_1 = require("../../common/utils/signature.utils");
const auth_service_1 = require("./auth.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transactions_schema_1 = require("../../schema/sts/transactions.schema");
const uuid_1 = require("uuid");
let VendingService = VendingService_1 = class VendingService {
    http;
    authService;
    txModel;
    baseUrl = process.env.STS_API_URL;
    logger = new common_1.Logger(VendingService_1.name);
    creds = {
        clientId: process.env.STS_CLIENT_ID ?? '',
        terminalId: process.env.STS_TERMINAL_ID ?? '',
        user: process.env.STS_USER ?? '',
        password: process.env.STS_PASS ?? '',
        userKey: process.env.STS_KEY ?? '',
        payType: '85',
    };
    constructor(http, authService, txModel) {
        this.http = http;
        this.authService = authService;
        this.txModel = txModel;
    }
    async vendPower(dto) {
        try {
            const token = await this.authService.getAuthToken();
            const seed = this.generateSeed();
            const transId = (0, uuid_1.v4)().replace(/-/g, '').slice(0, 16);
            const derivedKey = signature_utils_1.SignatureUtil.deriveKey(this.creds.user, this.creds.password, this.creds.userKey, seed);
            const payload = {
                version: '1',
                clientId: this.creds.clientId,
                terminalId: this.creds.terminalId,
                tokenName: 'Authorization',
                tokenValue: token,
                requestTime: this.formatUtcDateTime(),
                seed,
                transId,
                device: dto.meterNumber,
                amount: String(dto.amount),
                payType: this.creds.payType,
                amountType: 0,
            };
            const sign = signature_utils_1.SignatureUtil.generateSignature(payload, derivedKey);
            const body = { ...payload, sign, signType: 'MD5' };
            this.logger.debug('🧾 Vending Payload:', JSON.stringify(body, null, 2));
            this.logger.debug(`🌍 API Endpoint: ${this.baseUrl}/creditVend`);
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.baseUrl}/creditVend`, body));
            this.logger.debug('📦 Vending Response:', JSON.stringify(data, null, 2));
            await this.txModel.create({
                meterNumber: dto.meterNumber,
                amount: dto.amount,
                token: data?.tokenNo || data?.energyList?.[0]?.token || '',
                receiptNo: data?.receiptNo || '',
                transId,
                status: data.state === 0 ? 'success' : 'failed',
            });
            if (data.state !== 0) {
                throw new common_1.BadRequestException(data.message || 'Vending failed.');
            }
            return {
                success: true,
                message: 'Vend successful',
                data,
            };
        }
        catch (error) {
            this.logger.error(`Vend error: ${error.message}`);
            throw new common_1.BadRequestException(error.message);
        }
    }
    generateSeed() {
        return String(Date.now()).padStart(16, '0');
    }
    formatUtcDateTime(date = new Date()) {
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1);
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
};
exports.VendingService = VendingService;
exports.VendingService = VendingService = VendingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(transactions_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        auth_service_1.AuthService,
        mongoose_2.Model])
], VendingService);
//# sourceMappingURL=vending.service.js.map