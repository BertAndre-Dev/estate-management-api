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
var MeterMgtService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterMgtService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const meter_reading_schema_1 = require("../../schema/meter-mgt/meter-reading.schema");
const meter_schema_1 = require("../../schema/meter-mgt/meter.schema");
const transform_util_1 = require("../../common/utils/transform.util");
const signature_utils_1 = require("../../common/utils/signature.utils");
const uuid_1 = require("uuid");
const transaction_mgt_service_1 = require("../transaction-mgt/transaction-mgt.service");
const wallet_schema_1 = require("../../schema/wallet.schema");
const transaction_schema_1 = require("../../schema/transaction.schema");
const entry_schema_1 = require("../../schema/address/entry.schema");
const iec_client_service_1 = require("../iec/iec-client.service");
const real_time_gateway_1 = require("../../common/utils/real-time/real-time.gateway");
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
    logger = new common_1.Logger(MeterMgtService_1.name);
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
                const token = await this.ice.getToken();
                const details = await this.ice.detailsMeter(meter.meterNumber);
                const payload = details?.ack?.ResponseMessage?.Payload?.['m:DetailsMeter'];
                if (!payload) {
                    this.logger.error(`❌ No DetailsMeter payload for ${meter.meterNumber}`);
                    continue;
                }
                const dataTypes = payload?.['m:dataTypes']?.['m:dataType'] || [];
                const findType = (namePart) => dataTypes.find((x) => String(x?.['m:dTypeName']).toLowerCase().includes(namePart.toLowerCase()));
                const obisEnergy = findType("import active energy");
                const obisBalance = findType("residual credit");
                const obisPower = findType("instantaneous power");
                const obisVoltL1 = findType("l1 phase voltage");
                const obisVoltL2 = findType("l2 phase voltage");
                const obisVoltL3 = findType("l3 phase voltage");
                const obisCurrL1 = findType("l1 phase current");
                const obisCurrL2 = findType("l2 phase current");
                const obisCurrL3 = findType("l3 phase current");
                const read = async (obis) => {
                    if (!obis)
                        return null;
                    const resp = await this.ice.getMeterReadings(meter.meterNumber, obis['m:dTypeID']);
                    return Number(resp?.parsed?.value ?? 0);
                };
                const energy = await read(obisEnergy);
                const balance = await read(obisBalance);
                const power = await read(obisPower);
                const voltageL1 = await read(obisVoltL1);
                const voltageL2 = await read(obisVoltL2);
                const voltageL3 = await read(obisVoltL3);
                const currentL1 = await read(obisCurrL1);
                const currentL2 = await read(obisCurrL2);
                const currentL3 = await read(obisCurrL3);
                const lastEnergy = meter?._lastEnergy ?? (energy ?? 0);
                const consumption = (energy ?? 0) - lastEnergy;
                meter._lastEnergy = (energy ?? 0);
                this.gateway.publishMeterReading({
                    meterNumber: meter.meterNumber,
                    energy: energy ?? undefined,
                    instantaneousPower: power ?? undefined,
                    voltageL1: voltageL1 ?? undefined,
                    voltageL2: voltageL2 ?? undefined,
                    voltageL3: voltageL3 ?? undefined,
                    currentL1: currentL1 ?? undefined,
                    currentL2: currentL2 ?? undefined,
                    currentL3: currentL3 ?? undefined,
                    timestamp: new Date()
                });
                if (balance !== null) {
                    this.gateway.publishBalance({
                        meterNumber: meter.meterNumber,
                        balance,
                        used: energy ?? undefined,
                    });
                }
                this.gateway.publishDiagnostics({
                    meterNumber: meter.meterNumber,
                    voltageL1: voltageL1 ?? undefined,
                    voltageL2: voltageL2 ?? undefined,
                    voltageL3: voltageL3 ?? undefined,
                    currentL1: currentL1 ?? undefined,
                    currentL2: currentL2 ?? undefined,
                    currentL3: currentL3 ?? undefined,
                });
            }
            catch (err) {
                this.logger.error(`🔥 Realtime error on meter ${meter.meterNumber}`, err);
            }
        }
    }
    async getRealtimeReading(meterNumber) {
        try {
            if (!meterNumber || meterNumber.trim() === "") {
                throw new common_1.BadRequestException("Meter number is required");
            }
            this.logger.debug(`Fetching meter details for meterNumber: ${meterNumber}`);
            const details = await this.ice.detailsMeter(meterNumber);
            if (!details || !details?.ack?.ResponseMessage?.Payload) {
                throw new common_1.BadRequestException("Invalid response from HES for DetailsMeter");
            }
            const detailsMeterPayload = details.ack.ResponseMessage.Payload["m:DetailsMeter"];
            if (!detailsMeterPayload) {
                throw new common_1.BadRequestException("No DetailsMeter payload returned from HES");
            }
            this.logger.debug(`DetailsMeter payload received: ${JSON.stringify(detailsMeterPayload)}`);
            const obis = this.ice.extractObis(details, "Import Active Energy");
            if (!obis || !obis["m:dTypeID"]) {
                throw new common_1.BadRequestException("OBIS for Import Active Energy not found");
            }
            this.logger.debug(`OBIS found: ${JSON.stringify(obis)}`);
            const readingResp = await this.ice.readData(meterNumber, obis["m:dTypeID"]);
            const value = Number(readingResp?.ack?.ResponseMessage?.Payload?.value ?? 0);
            this.logger.debug(`Meter reading received: ${value}`);
            return {
                success: true,
                message: 'Meter real time reading rerieved successfully.',
                data: {
                    meterNumber,
                    energy: value,
                    timestamp: new Date()
                }
            };
        }
        catch (error) {
            this.logger.error(`Error fetching realtime reading for meter ${meterNumber}: ${error.message}`);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getRealtimeBalance(meterNumber) {
        try {
            const details = await this.ice.detailsMeter(meterNumber);
            const residual = this.ice.extractObis(details, "Residual Credit");
            const importEnergy = this.ice.extractObis(details, "Import Active Energy");
            if (!residual)
                throw new common_1.NotFoundException("Residual Credit OBIS not found");
            if (!importEnergy)
                throw new common_1.NotFoundException("Import Energy OBIS not found");
            const balRaw = await this.ice.readData(meterNumber, residual["m:dTypeID"]);
            const eneRaw = await this.ice.readData(meterNumber, importEnergy["m:dTypeID"]);
            const balance = Number(balRaw?.ack?.ResponseMessage?.Payload?.value ?? 0);
            const energy = Number(eneRaw?.ack?.ResponseMessage?.Payload?.value ?? 0);
            return {
                success: true,
                message: "Meter usage retrieved successfully.",
                data: {
                    meterNumber,
                    balance,
                    used: energy,
                    timestamp: new Date(),
                }
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    ;
    async getConsumptionChart(meterNumber, range = "weekly") {
        try {
            if (!meterNumber)
                throw new common_1.BadRequestException("Meter number is required");
            const details = await this.ice.detailsMeter(meterNumber);
            const detailsMeterPayload = details?.ack?.ResponseMessage?.Payload?.["m:DetailsMeter"];
            if (!detailsMeterPayload) {
                throw new common_1.NotFoundException("No DetailsMeter payload returned");
            }
            let profileName = "";
            switch (range) {
                case "daily":
                    profileName = "Daily billing profile";
                    break;
                case "weekly":
                    profileName = "Load Profile 1";
                    break;
                case "monthly":
                    profileName = "Monthly billing profile";
                    break;
                case "yearly":
                    profileName = "Import Active Energy Last 1 Month";
                    break;
                default:
                    profileName = "Daily billing profile";
            }
            const obis = this.ice.extractObis(details, profileName);
            if (!obis)
                throw new common_1.NotFoundException(`OBIS not found for ${profileName}`);
            const raw = await this.ice.readData(meterNumber, obis["m:dTypeID"]);
            const values = raw?.ack?.ResponseMessage?.Payload?.value ?? [];
            const chart = Array.isArray(values)
                ? values.map((v, i) => ({
                    time: new Date(v.timestamp ?? Date.now() - (values.length - i) * 3600 * 1000),
                    value: Number(v.value ?? 0),
                }))
                : [
                    {
                        time: new Date(),
                        value: Number(values ?? 0),
                    },
                ];
            return {
                success: true,
                message: "Meter consumption chart retrieved successfully",
                data: {
                    meterNumber,
                    range,
                    from: chart[0]?.time ?? new Date(),
                    to: chart[chart.length - 1]?.time ?? new Date(),
                    count: chart.length,
                    chart,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async addMeter(dto) {
        try {
            const lookupMeter = await this.lookupMeterFromMerchant(dto.meterNumber);
            if (!lookupMeter || lookupMeter.state !== 0) {
                throw new common_1.NotFoundException("Meter not on the merchant system");
            }
            const existingMeter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });
            if (existingMeter) {
                throw new common_1.BadRequestException("Meter already existing on the DB.");
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
                data: (0, transform_util_1.toResponseObject)(meter)
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    ;
    async removeMeter(dto) {
        try {
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });
            if (!meter) {
                throw new common_1.NotFoundException("Meter not found.");
            }
            if (meter.isAssigned) {
                throw new common_1.BadRequestException("Meter is assigned to an address. Unassign it before removing.");
            }
            meter.estateId = null;
            await meter.save();
            return {
                success: true,
                message: "Meter removed from estate successfully.",
                data: (0, transform_util_1.toResponseObject)(meter),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    ;
    async reassignMeter(dto) {
        try {
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });
            if (!meter) {
                throw new common_1.NotFoundException("Meter not found.");
            }
            if (meter.isAssigned) {
                throw new common_1.BadRequestException("Meter is currently assigned to an address. Unassign it first.");
            }
            meter.estateId = dto.newEstateId;
            meter.isAssigned = true;
            await meter.save();
            return {
                success: true,
                message: "Meter successfully reassigned to new estate.",
                data: (0, transform_util_1.toResponseObject)(meter)
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async assignMeterToAddress(dto) {
        try {
            if (!dto.addressId) {
                throw new common_1.BadRequestException("addressId is required to assign meter.");
            }
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });
            if (!meter) {
                throw new common_1.NotFoundException("Meter not found.");
            }
            if (meter.isAssigned) {
                throw new common_1.BadRequestException("Meter has already been assigned.");
            }
            meter.addressId = dto.addressId;
            meter.isAssigned = true;
            await meter.save();
            return {
                success: true,
                message: "Meter assigned to address successfully.",
                data: (0, transform_util_1.toResponseObject)(meter)
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getMeterByAddress(addressId) {
        try {
            const address = await this.entryModel.findById(addressId);
            if (!address) {
                throw new common_1.NotFoundException('Address does not exist.');
            }
            const meter = await this.meterModel.findOne({ addressId });
            if (!meter) {
                throw new common_1.NotFoundException('No meter is assigned to this address.');
            }
            const enrichedMeter = await this.enrichMeterWithVendorData(meter);
            return {
                success: true,
                message: 'Meter retrieved successfully for this address.',
                data: enrichedMeter,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to fetch meter by address.');
        }
    }
    async updateMeter(id, dto) {
        try {
            const meter = await this.meterModel.findById(id);
            if (!meter) {
                throw new common_1.NotFoundException('Meter not found.');
            }
            Object.assign(meter, dto);
            try {
                const token = await this.getVendorAuthToken();
                await this.updateMeterOnVendor(meter.meterNumber, dto, token);
            }
            catch (error) {
                throw new common_1.BadRequestException(error.message);
            }
            await meter.save();
            return {
                success: true,
                message: 'Meter updated successfully.'
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async trialVend(dto) {
        try {
            const wallet = await this.walletModel.findById(dto.walletId);
            if (!wallet) {
                throw new common_1.BadRequestException('Wallet not found.');
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
            const transId = (0, uuid_1.v4)().replace(/-/g, '').slice(0, 16);
            const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
            const derivedKey = signature_utils_1.SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
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
            const sign = signature_utils_1.SignatureUtil.generateSignature(payload, derivedKey);
            const body = { ...payload, sign, signType: 'MD5' };
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.baseUrl}/trialCreditVend`, body, { headers: { "Content-Type": "application/json" } }));
            if (!data || data.state !== 0) {
                const wallet = await this.walletModel.findById(dto.walletId);
                if (!wallet) {
                    throw new common_1.BadRequestException('Wallet not found.');
                }
                await this.transaction.createTransaction({
                    walletId: dto.walletId,
                    userId: wallet.userId,
                    type: 'debit',
                    amount: dto.amount,
                    description: `Trial vend for meter ${dto.meterNumber}`,
                });
                throw new common_1.BadRequestException(data?.message || 'Trial vend failed.');
            }
            return {
                success: true,
                message: 'Trial vend successful.',
                data,
                transId,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async vend(dto, transId) {
        try {
            const token = await this.getVendorAuthToken();
            const seed = String(Date.now()).padStart(16, '0');
            const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
            const derivedKey = signature_utils_1.SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
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
            const sign = signature_utils_1.SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
            const body = { ...payload, sign, signType: 'MD5' };
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.baseUrl}/creditVend`, body));
            if (data.state !== 0) {
                throw new common_1.BadRequestException(data.message || 'Vend failed.');
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
            throw new common_1.BadRequestException(error.message);
        }
    }
    async disconnectMeter(dto) {
        try {
            const response = await this.ice.disconnectMeter(dto.meterNumber);
            const reply = response?.ack?.ResponseMessage?.Reply;
            if (!reply || reply.Result !== 'OK' || reply.Error?.code !== '0.0') {
                throw new common_1.NotFoundException(`Meter ${dto.meterNumber} could not be disconnected.`);
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
                throw new common_1.NotFoundException(`Meter ${dto.meterNumber} could not be reconnected.`);
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
            const derivedKey = signature_utils_1.SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
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
            const sign = signature_utils_1.SignatureUtil.generateSignature(payload, derivedKey);
            const body = { ...payload, sign, signType: "MD5" };
            this.logger.debug("🧾 CustomerDetails Payload:", JSON.stringify(body, null, 2));
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.baseUrl}/customerDetails`, body, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }));
            this.logger.debug("📩 CustomerDetails Response:", data);
            if (!data || data.state !== 0) {
                throw new common_1.BadRequestException(data?.message || "Meter lookup failed.");
            }
            return data;
        }
        catch (error) {
            this.logger.error("❌ lookupMeterFromMerchant Error:", error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async enrichMeterWithVendorData(meter) {
        try {
            const vendorData = await this.lookupMeterFromMerchant(meter.meterNumber);
            return {
                ...(0, transform_util_1.toResponseObject)(meter),
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
                ...(0, transform_util_1.toResponseObject)(meter),
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
                throw new common_1.NotFoundException('No meters found for this estate.');
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
            throw new common_1.BadRequestException(error.message || 'Failed to fetch meters by estate.');
        }
    }
    async getMeter(id) {
        try {
            const meter = await this.meterModel.findById(id);
            if (!meter) {
                throw new common_1.NotFoundException('Meter not found');
            }
            const enriched = await this.enrichMeterWithVendorData(meter);
            return {
                success: true,
                message: 'Meter retrieved successfully.',
                data: enriched
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
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
        const key = signature_utils_1.SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
        const sign = signature_utils_1.SignatureUtil.generateSignature(payload, key);
        const body = { ...payload, sign, signType: 'MD5' };
        this.logger.debug('🧾 Auth Payload JSON:', JSON.stringify(body, null, 2));
        this.logger.debug(`🌍 API Endpoint: ${this.baseUrl}/authToken`);
        const { data, status } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.baseUrl}/authToken`, body, {
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            validateStatus: () => true,
        }));
        this.logger.debug('================ RESPONSE DEBUG ================');
        this.logger.debug('Status:', status);
        this.logger.debug('Body:', data);
        this.logger.debug('=================================================');
        if (!data || data.state !== 0) {
            throw new common_1.BadRequestException(`Vendor auth failed: ${data?.message || 'Unknown error'}`);
        }
        this.logger.log('✅ Vendor Auth Success — Token:', data.tokenValue);
        return data.tokenValue;
    }
    async verifyMeterWithVendor(meterNumber, token) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
        const derivedKey = signature_utils_1.SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
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
        const sign = signature_utils_1.SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
        const body = { ...payload, sign, signType: 'MD5' };
        const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.baseUrl}/customerDetails`, body));
        return data.state === 0 ? data : null;
    }
    async registerMeterWithVendor(dto, token) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
        const derivedKey = signature_utils_1.SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
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
        const sign = signature_utils_1.SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
        const body = { ...payload, sign, signType: 'MD5' };
        const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.baseUrl}/addCustomer`, body));
        if (data.state !== 0) {
            throw new common_1.BadRequestException(`Vendor registration failed: ${data.message}`);
        }
        return data;
    }
    async updateMeterOnVendor(meterNumber, dto, token) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
        const derivedKey = signature_utils_1.SignatureUtil.deriveKey(STS_USER, STS_PASS, STS_KEY, seed);
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
        const sign = signature_utils_1.SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
        const body = { ...payload, sign, signType: 'MD5' };
        const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.baseUrl}/updateCustomer`, body));
        if (data.state !== 0) {
            throw new common_1.BadRequestException(`Vendor update failed: ${data.message}`);
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
exports.MeterMgtService = MeterMgtService;
__decorate([
    (0, schedule_1.Cron)("*/30 * * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MeterMgtService.prototype, "monitorMeters", null);
exports.MeterMgtService = MeterMgtService = MeterMgtService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_1.InjectModel)(meter_reading_schema_1.MeterReading.name)),
    __param(5, (0, mongoose_1.InjectModel)(meter_schema_1.Meter.name)),
    __param(6, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __param(7, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(8, (0, mongoose_1.InjectModel)(entry_schema_1.Entry.name)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        transaction_mgt_service_1.TransactionMgtService,
        iec_client_service_1.IecClientService,
        real_time_gateway_1.RealtimeGateway,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MeterMgtService);
//# sourceMappingURL=meter-mgt.service.js.map