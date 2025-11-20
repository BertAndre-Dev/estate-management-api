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
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SignatureUtil } from "../../common/utils/signature.utils";
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from "../../schema/sts/transactions.schema";
import { v4 as uuid } from 'uuid';
let VendingService = VendingService_1 = class VendingService {
    http;
    authService;
    txModel;
    baseUrl = process.env.STS_API_URL;
    logger = new Logger(VendingService_1.name);
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
            const transId = uuid().replace(/-/g, '').slice(0, 16);
            const derivedKey = SignatureUtil.deriveKey(this.creds.user, this.creds.password, this.creds.userKey, seed);
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
            const sign = SignatureUtil.generateSignature(payload, derivedKey);
            const body = { ...payload, sign, signType: 'MD5' };
            this.logger.debug('🧾 Vending Payload:', JSON.stringify(body, null, 2));
            this.logger.debug(`🌍 API Endpoint: ${this.baseUrl}/creditVend`);
            const { data } = await firstValueFrom(this.http.post(`${this.baseUrl}/creditVend`, body));
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
                throw new BadRequestException(data.message || 'Vending failed.');
            }
            return {
                success: true,
                message: 'Vend successful',
                data,
            };
        }
        catch (error) {
            this.logger.error(`Vend error: ${error.message}`);
            throw new BadRequestException(error.message);
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
VendingService = VendingService_1 = __decorate([
    Injectable(),
    __param(2, InjectModel(Transaction.name)),
    __metadata("design:paramtypes", [HttpService,
        AuthService,
        Model])
], VendingService);
export { VendingService };
//# sourceMappingURL=vending.service.js.map