var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var IecAuthService_1;
import { Injectable, Logger } from '@nestjs/common';
import { IecClientService } from './iec-client.service';
let IecAuthService = IecAuthService_1 = class IecAuthService {
    iecClient;
    logger = new Logger(IecAuthService_1.name);
    constructor(iecClient) {
        this.iecClient = iecClient;
    }
    async getToken() {
        const payload = {
            'm:GetUserToken': {
                'm:UserID': process.env.HES_USER || '',
                'm:Password': process.env.HES_PASS || '',
            },
        };
        this.logger.log('Requesting HES GetUserToken');
        const resp = await this.iecClient.postRequest('GetUserToken', payload);
        return resp;
    }
};
IecAuthService = IecAuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [IecClientService])
], IecAuthService);
export { IecAuthService };
//# sourceMappingURL=auth.service.js.map