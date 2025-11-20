var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SignatureUtil } from "../../common/utils/signature.utils";
let AuthService = AuthService_1 = class AuthService {
    http;
    logger = new Logger(AuthService_1.name);
    baseUrl;
    creds;
    constructor(http) {
        this.http = http;
        this.baseUrl = this.requireEnv('STS_API_URL');
        this.creds = {
            clientId: this.requireEnv('STS_CLIENT_ID'),
            terminalId: this.requireEnv('STS_TERMINAL_ID'),
            user: this.requireEnv('STS_USER'),
            password: this.requireEnv('STS_PASS'),
            userKey: this.requireEnv('STS_KEY'),
        };
    }
    requireEnv(key) {
        const val = process.env[key];
        if (!val)
            throw new Error(`Missing required env var: ${key}`);
        return val;
    }
    formatUtcDateTime() {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    generateSeed() {
        const rand = Math.floor(Math.random() * 1e16);
        return rand.toString().padStart(16, '0');
    }
    async getAuthToken() {
        try {
            const seed = this.generateSeed();
            const key = SignatureUtil.deriveKey(this.creds.user, this.creds.password, this.creds.userKey, seed);
            const payload = {
                version: 1,
                clientId: this.creds.clientId,
                terminalId: this.creds.terminalId,
                requestTime: this.formatUtcDateTime(),
                user: this.creds.user,
                seed,
            };
            const sign = SignatureUtil.generateSignature(payload, key);
            const body = { ...payload, sign, signType: 'MD5' };
            this.logger.debug('🧾 Auth Payload: ' + JSON.stringify(body, null, 2));
            this.logger.debug(`🌍 API Endpoint: ${this.baseUrl}/authToken`);
            const { data } = await firstValueFrom(this.http.post(`${this.baseUrl}/authToken`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }));
            this.logger.debug(`📩 Auth Response: ${JSON.stringify(data)}`);
            if (!data || data.state !== 0) {
                throw new BadRequestException(`Auth failed: ${data?.message || 'Unknown error'}`);
            }
            return data.tokenValue;
        }
        catch (error) {
            this.logger.error('Auth token fetch failed:', error);
            throw new BadRequestException(error.message);
        }
    }
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map