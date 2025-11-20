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
var MeterMgtService_1;
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeterReading } from "../../schema/meter-mgt/meter-reading.schema";
import { Meter } from "../../schema/meter-mgt/meter.schema";
import { toResponseObject } from "../../common/utils/transform.util";
import { SignatureUtil } from "../../common/utils/signature.utils";
import { v4 as uuid } from 'uuid';
import { TransactionMgtService } from '../transaction-mgt/transaction-mgt.service';
import { Wallet } from "../../schema/wallet.schema";
import { Transaction } from "../../schema/transaction.schema";
import { Entry } from "../../schema/address/entry.schema";
import { IecClientService } from '../iec/iec-client.service';
import { RealtimeGateway } from "../../common/utils/real-time/real-time.gateway";
let MeterMgtService = MeterMgtService_1 = class MeterMgtService {
    http;
    transaction;
    ice;
    gateway;
    meterReadingModel;
    meterModel;
    walletModel;
    transactionModel;
    entryModel;
    baseUrl = process.env.STS_API_URL;
    logger = new Logger(MeterMgtService_1.name);
    constructor(http, transaction, ice, gateway, meterReadingModel, meterModel, walletModel, transactionModel, entryModel) {
        this.http = http;
        this.transaction = transaction;
        this.ice = ice;
        this.gateway = gateway;
        this.meterReadingModel = meterReadingModel;
        this.meterModel = meterModel;
        this.walletModel = walletModel;
        this.transactionModel = transactionModel;
        this.entryModel = entryModel;
    }
    async monitorMeters() {
        const meters = await this.meterModel.find();
        for (const meter of meters) {
            try {
                const energyObis = meter.supportedDataTypes?.find((x) => String(x.dTypeName).toLowerCase().includes("import active energy"));
                if (!energyObis)
                    continue;
                const reading = await this.ice.getMeterReadings(meter.meterNumber, energyObis.dTypeID);
                const energyNow = Number(reading?.parsed?.value ?? 0);
                const last = meter.lastReading ?? null;
                let consumption = last ? energyNow - (last.energy ?? 0) : 0;
                let balance = Number(meter.lastTokenKwh ?? 0) - energyNow;
                if (balance < 0)
                    balance = 0;
                meter.lastReading = {
                    timestamp: new Date().toISOString(),
                    energy: energyNow,
                    consumption,
                };
                meter.balance = balance;
                await meter.save();
                this.gateway.broadcastMeterUpdate?.({
                    meterNumber: meter.meterNumber,
                    energy: energyNow,
                    consumption,
                    balance,
                });
            }
            catch (e) {
                this.logger.error(`Realtime error for meter ${meter.meterNumber}`, e);
            }
        }
    }
    async addMeter(dto) {
        try {
            const lookupMeter = await this.lookupMeterFromMerchant(dto.meterNumber);
            if (!lookupMeter || lookupMeter.state !== 0) {
                throw new NotFoundException("Meter not on the merchant system");
            }
            const existingMeter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });
            if (existingMeter) {
                throw new BadRequestException("Meter already existing on the DB.");
            }
            const meter = await this.meterModel.create({
                meterNumber: dto.meterNumber,
                estateId: dto.estateId,
                refName: lookupMeter?.data?.refName,
                refCode: lookupMeter?.data?.refCode,
                lastCredit: 0
            });
            return {
                success: true,
                message: "Meter added successfully.",
                data: toResponseObject(meter)
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    ;
    async removeMeter(dto) {
        try {
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });
            if (!meter) {
                throw new NotFoundException("Meter not found.");
            }
            if (meter.isAssigned) {
                throw new BadRequestException("Meter is assigned to an address. Unassign it before removing.");
            }
            meter.estateId = null;
            await meter.save();
            return {
                success: true,
                message: "Meter removed from estate successfully.",
                data: toResponseObject(meter),
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    ;
    async reassignMeter(dto) {
        try {
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });
            if (!meter) {
                throw new NotFoundException("Meter not found.");
            }
            if (meter.isAssigned) {
                throw new BadRequestException("Meter is currently assigned to an address. Unassign it first.");
            }
            meter.estateId = dto.newEstateId;
            meter.isAssigned = true;
            await meter.save();
            return {
                success: true,
                message: "Meter successfully reassigned to new estate.",
                data: toResponseObject(meter)
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async assignMeterToAddress(dto) {
        try {
            if (!dto.addressId) {
                throw new BadRequestException("addressId is required to assign meter.");
            }
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });
            if (!meter) {
                throw new NotFoundException("Meter not found.");
            }
            if (meter.isAssigned) {
                throw new BadRequestException("Meter has already been assigned.");
            }
            meter.addressId = dto.addressId;
            meter.isAssigned = true;
            await meter.save();
            return {
                success: true,
                message: "Meter assigned to address successfully.",
                data: toResponseObject(meter)
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getMeterByAddress(addressId) {
        try {
            const address = await this.entryModel.findById(addressId);
            if (!address) {
                throw new NotFoundException('Address does not exist.');
            }
            const meter = await this.meterModel.findOne({ addressId });
            if (!meter) {
                throw new NotFoundException('No meter is assigned to this address.');
            }
            const enrichedMeter = await this.enrichMeterWithVendorData(meter);
            return {
                success: true,
                message: 'Meter retrieved successfully for this address.',
                data: enrichedMeter,
            };
        }
        catch (error) {
            throw new BadRequestException(error.message || 'Failed to fetch meter by address.');
        }
    }
    async updateMeter(id, dto) {
        try {
            const meter = await this.meterModel.findById(id);
            if (!meter) {
                throw new NotFoundException('Meter not found.');
            }
            Object.assign(meter, dto);
            try {
                const token = await this.getVendorAuthToken();
                await this.updateMeterOnVendor(meter.meterNumber, dto, token);
            }
            catch (error) {
                throw new BadRequestException(error.message);
            }
            await meter.save();
            return {
                success: true,
                message: 'Meter updated successfully.'
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async trialVend(dto) {
        try {
            const wallet = await this.walletModel.findById(dto.walletId);
            if (!wallet) {
                throw new BadRequestException('Wallet not found.');
            }
            await this.transaction.createTransaction({
                walletId: dto.walletId,
                userId: wallet.userId,
                type: 'debit',
                amount: dto.amount,
                description: `Trial vend for meter ${dto.meterNumber}`,
            });
            const token = await this.getVendorAuthToken();
            const seed = Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
            const transId = uuid().replace(/-/g, '').slice(0, 16);
            const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
            const derivedKey = SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
            const payload = {
                version: 1,
                clientId: STS_CLIENT_ID,
                terminalId: STS_TERMINAL_ID,
                tokenName: 'Authorization',
                tokenValue: token,
                requestTime: this.formatLocalDateTime(),
                seed,
                transId,
                device: dto.meterNumber,
                amount: String(dto.amount),
                payType: '85',
                amountType: 0,
            };
            const sign = SignatureUtil.generateSignature(payload, derivedKey);
            const body = { ...payload, sign, signType: 'MD5' };
            const { data } = await firstValueFrom(this.http.post(`${this.baseUrl}/trialCreditVend`, body, { headers: { "Content-Type": "application/json" } }));
            if (!data || data.state !== 0) {
                const wallet = await this.walletModel.findById(dto.walletId);
                if (!wallet) {
                    throw new BadRequestException('Wallet not found.');
                }
                await this.transaction.createTransaction({
                    walletId: dto.walletId,
                    userId: wallet.userId,
                    type: 'debit',
                    amount: dto.amount,
                    description: `Trial vend for meter ${dto.meterNumber}`,
                });
                throw new BadRequestException(data?.message || 'Trial vend failed.');
            }
            return {
                success: true,
                message: 'Trial vend successful.',
                data,
                transId,
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async vend(dto, transId) {
        try {
            const token = await this.getVendorAuthToken();
            const seed = String(Date.now()).padStart(16, '0');
            const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
            const derivedKey = SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
            const payload = {
                version: "1",
                clientId: STS_CLIENT_ID,
                terminalId: STS_TERMINAL_ID,
                tokenName: 'Authorization',
                tokenValue: token,
                requestTime: this.formatLocalDateTime(),
                seed,
                transId,
                device: dto.meterNumber,
                amount: String(dto.amount),
                payType: '85',
                amountType: 0,
            };
            const sign = SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
            const body = { ...payload, sign, signType: 'MD5' };
            const { data } = await firstValueFrom(this.http.post(`${this.baseUrl}/creditVend`, body));
            if (data.state !== 0) {
                throw new BadRequestException(data.message || 'Vend failed.');
            }
            await this.meterReadingModel.create({
                meterNumber: dto.meterNumber,
                receivedToken: data.energyList?.[0]?.token ?? null,
                amount: dto.amount,
                transId,
            });
            return {
                success: true,
                message: 'Vend successful.',
                data,
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async disconnectMeter(dto) {
        try {
            const response = await this.ice.disconnectMeter(dto.meterNumber);
            const reply = response?.ack?.ResponseMessage?.Reply;
            if (!reply || reply.Result !== 'OK' || reply.Error?.code !== '0.0') {
                throw new NotFoundException(`Meter ${dto.meterNumber} could not be disconnected.`);
            }
            return {
                message: `Meter ${dto.meterNumber} disconnected successfully.`,
                data: reply,
            };
        }
        catch (error) {
            if (error.response) {
                throw new Error(`IEC API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`Failed to disconnect meter: ${error.message}`);
        }
    }
    ;
    async reconnectMeter(dto) {
        try {
            const response = await this.ice.reconnectMeter(dto.meterNumber);
            const reply = response?.ack?.ResponseMessage?.Reply;
            if (!reply || reply.Result !== 'OK' || reply.Error?.code !== '0.0') {
                throw new NotFoundException(`Meter ${dto.meterNumber} could not be reconnected.`);
            }
            return {
                message: `Meter ${dto.meterNumber} reconnected successfully.`,
                data: reply,
            };
        }
        catch (error) {
            if (error.response) {
                throw new Error(`IEC API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`Failed to reconnected meter: ${error.message}`);
        }
    }
    async lookupMeterFromMerchant(meterNumber) {
        try {
            const token = await this.getVendorAuthToken();
            const seed = Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
            const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
            const derivedKey = SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
            const payload = {
                version: 1,
                clientId: STS_CLIENT_ID,
                terminalId: STS_TERMINAL_ID,
                tokenName: "Authorization",
                tokenValue: token,
                requestTime: this.formatLocalDateTime(),
                seed,
                value: meterNumber,
            };
            const sign = SignatureUtil.generateSignature(payload, derivedKey);
            const body = { ...payload, sign, signType: "MD5" };
            this.logger.debug("🧾 CustomerDetails Payload:", JSON.stringify(body, null, 2));
            const { data } = await firstValueFrom(this.http.post(`${this.baseUrl}/customerDetails`, body, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }));
            this.logger.debug("📩 CustomerDetails Response:", data);
            if (!data || data.state !== 0) {
                throw new BadRequestException(data?.message || "Meter lookup failed.");
            }
            return data;
        }
        catch (error) {
            this.logger.error("❌ lookupMeterFromMerchant Error:", error);
            throw new BadRequestException(error.message);
        }
    }
    async enrichMeterWithVendorData(meter) {
        try {
            const vendorData = await this.lookupMeterFromMerchant(meter.meterNumber);
            return {
                ...toResponseObject(meter),
                vendorData: {
                    name: vendorData.name,
                    device: vendorData.device,
                    refName: vendorData.refName,
                    refCode: vendorData.refCode,
                    address: vendorData.address,
                    maxVend: vendorData.maxVend,
                    minVend: vendorData.minVend,
                    status: vendorData.status,
                    utilityName: vendorData.utilityName,
                    time: vendorData.time,
                },
            };
        }
        catch {
            return {
                ...toResponseObject(meter),
                vendorData: null,
            };
        }
    }
    async getMetersByEstateId(estateId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [meters, total] = await Promise.all([
                this.meterModel.find({ estateId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
                this.meterModel.countDocuments({ estateId }),
            ]);
            if (!meters.length) {
                throw new NotFoundException('No meters found for this estate.');
            }
            const enrichedMeters = await Promise.all(meters.map((meter) => this.enrichMeterWithVendorData(meter)));
            return {
                success: true,
                message: 'Meters retrieved successfully.',
                data: enrichedMeters,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new BadRequestException(error.message || 'Failed to fetch meters by estate.');
        }
    }
    async getMeter(id) {
        try {
            const meter = await this.meterModel.findById(id);
            if (!meter) {
                throw new NotFoundException('Meter not found');
            }
            const enriched = await this.enrichMeterWithVendorData(meter);
            return {
                success: true,
                message: 'Meter retrieved successfully.',
                data: enriched
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getVendorAuthToken() {
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_KEY, STS_PASS } = process.env;
        this.logger.debug(`🔍 STS_PASS (RAW from ENV): "${STS_PASS}" length=${STS_PASS?.length}`);
        const seed = Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
        const requestTime = this.formatLocalDateTime();
        const payload = {
            version: "1",
            clientId: STS_CLIENT_ID,
            terminalId: STS_TERMINAL_ID,
            requestTime,
            user: STS_USER,
            seed,
        };
        const key = SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
        const sign = SignatureUtil.generateSignature(payload, key);
        const body = { ...payload, sign, signType: 'MD5' };
        this.logger.debug('🧾 Auth Payload JSON:', JSON.stringify(body, null, 2));
        this.logger.debug(`🌍 API Endpoint: ${this.baseUrl}/authToken`);
        const { data, status } = await firstValueFrom(this.http.post(`${this.baseUrl}/authToken`, body, {
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            validateStatus: () => true,
        }));
        this.logger.debug('================ RESPONSE DEBUG ================');
        this.logger.debug('Status:', status);
        this.logger.debug('Body:', data);
        this.logger.debug('=================================================');
        if (!data || data.state !== 0) {
            throw new BadRequestException(`Vendor auth failed: ${data?.message || 'Unknown error'}`);
        }
        this.logger.log('✅ Vendor Auth Success — Token:', data.tokenValue);
        return data.tokenValue;
    }
    async verifyMeterWithVendor(meterNumber, token) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
        const derivedKey = SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
        const payload = {
            version: "1",
            clientId: STS_CLIENT_ID,
            terminalId: STS_TERMINAL_ID,
            tokenName: 'Authorization',
            tokenValue: token,
            requestTime: this.formatLocalDateTime(),
            device: meterNumber,
            seed,
        };
        const sign = SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
        const body = { ...payload, sign, signType: 'MD5' };
        const { data } = await firstValueFrom(this.http.post(`${this.baseUrl}/customerDetails`, body));
        return data.state === 0 ? data : null;
    }
    async registerMeterWithVendor(dto, token) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
        const derivedKey = SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
        const payload = {
            version: "1",
            clientId: STS_CLIENT_ID,
            terminalId: STS_TERMINAL_ID,
            tokenName: 'Authorization',
            tokenValue: token,
            requestTime: this.formatLocalDateTime(),
            device: dto.meterNumber,
            customerName: dto.userId ?? 'Unknown',
            customerAddress: dto.addressId ?? 'Unknown',
            seed,
        };
        const sign = SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
        const body = { ...payload, sign, signType: 'MD5' };
        const { data } = await firstValueFrom(this.http.post(`${this.baseUrl}/addCustomer`, body));
        if (data.state !== 0) {
            throw new BadRequestException(`Vendor registration failed: ${data.message}`);
        }
        return data;
    }
    async updateMeterOnVendor(meterNumber, dto, token) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
        const derivedKey = SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
        const payload = {
            version: "1",
            clientId: STS_CLIENT_ID,
            terminalId: STS_TERMINAL_ID,
            tokenName: 'Authorization',
            tokenValue: token,
            requestTime: this.formatLocalDateTime(),
            device: meterNumber,
            customerName: dto.userId ?? 'Unknown',
            customerAddress: dto.addressId ?? 'N/A',
            seed,
        };
        const sign = SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
        const body = { ...payload, sign, signType: 'MD5' };
        const { data } = await firstValueFrom(this.http.post(`${this.baseUrl}/updateCustomer`, body));
        if (data.state !== 0) {
            throw new BadRequestException(`Vendor update failed: ${data.message}`);
        }
        return data;
    }
    formatLocalDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
};
__decorate([
    Cron("*/30 * * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MeterMgtService.prototype, "monitorMeters", null);
MeterMgtService = MeterMgtService_1 = __decorate([
    Injectable(),
    __param(4, InjectModel(MeterReading.name)),
    __param(5, InjectModel(Meter.name)),
    __param(6, InjectModel(Wallet.name)),
    __param(7, InjectModel(Transaction.name)),
    __param(8, InjectModel(Entry.name)),
    __metadata("design:paramtypes", [HttpService,
        TransactionMgtService,
        IecClientService,
        RealtimeGateway,
        Model,
        Model,
        Model,
        Model,
        Model])
], MeterMgtService);
export { MeterMgtService };
//# sourceMappingURL=meter-mgt.service.js.map