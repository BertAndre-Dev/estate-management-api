import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeterReading, MeterReadingDocument } from 'src/schema/meter-mgt/meter-reading.schema';
import { Meter, MeterDocument } from 'src/schema/meter-mgt/meter.schema';
import { MeterDto } from 'src/dto/meter.dto';
import { toResponseObject } from 'src/common/utils/transform.util';
import { SignatureUtil } from 'src/common/utils/signature.utils';
import { VendPowerDto } from 'src/dto/vend-power.dto';
import { v4 as uuid } from 'uuid';
import { TransactionMgtService } from '../transaction-mgt/transaction-mgt.service';
import { Wallet, WalletDocument } from 'src/schema/wallet.schema';
import { Transaction, TransactionDocument } from 'src/schema/transaction.schema';
import { Entry, EntryDocument } from 'src/schema/address/entry.schema';

@Injectable()
export class MeterMgtService {
  private baseUrl = process.env.STS_API_URL!;
  private readonly logger = new Logger(MeterMgtService.name);

  constructor(
    private http: HttpService,
    private transaction: TransactionMgtService,
    @InjectModel(MeterReading.name) private meterReadingModel: Model<MeterReadingDocument>,
    @InjectModel(Meter.name) private meterModel: Model<MeterDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}


    // 🔋 Power usage history 
    // async getPowerUsage(meterNumber: string, days = 1) {
    //     try {
    //         // 1) Vendor lookup first
    //         const vendorData = await this.lookupMeterFromMerchant(meterNumber);

    //         // 2) DB usage calculation as before
    //         const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    //         const readings = await this.meterReadingModel
    //         .find({ meterNumber, createdAt: { $gte: since } })
    //         .sort({ createdAt: 1 });

    //         const used = readings.length > 1
    //         ? (readings.at(-1)?.energy ?? 0) - (readings[0]?.energy ?? 0)
    //         : 0;

    //         const tariff = parseFloat(process.env.TARIFF_RATE || '100');
    //         const cost = used * tariff;

    //         return {
    //         success: true,
    //         message: 'Meter usage retrieved successfully.',
    //         data: {
    //             meterNumber,
    //             vendorData,
    //             energyUsed: used,
    //             estimatedCost: cost,
    //             tariffRate: tariff,
    //         },
    //         };
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }


    // Add meter to an estate
    async addMeter(dto: MeterDto) {
        try {
            // Check if meter exist on the mrchant system
            const lookupMeter = await this.lookupMeterFromMerchant(dto.meterNumber);

            if (!lookupMeter || lookupMeter.state !== 0) {
                throw new NotFoundException("Meter not on the merchant system");
            }

            // Check if the meter exist on the DB
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
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    };


    // Remove meter from an estate
    async removeMeter(dto: MeterDto) {
        try {
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });

            if (!meter) {
            throw new NotFoundException("Meter not found.");
            }

            // Prevent removal if meter is currently assigned to an address
            if (meter.isAssigned) {
            throw new BadRequestException("Meter is assigned to an address. Unassign it before removing.");
            }

            // Remove estate link (not delete meter record)
            meter.estateId = null!;
            await meter.save();

            return {
                success: true,
                message: "Meter removed from estate successfully.",
                data: toResponseObject(meter),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    };

    // Re-assign meter to a new estate
    async reassignMeter(dto: MeterDto) {
        try {
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber });

            if (!meter) {
                throw new NotFoundException("Meter not found.");
            }

            // Prevent reassignment if currently assigned to a house
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
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Assign meter to estate address
    async assignMeterToAddress(dto: MeterDto) {
        try {
            // Check if the addressId exist
            if (!dto.addressId) {
                throw new BadRequestException("addressId is required to assign meter.");
            }

            // Check if the meter exist
            const meter = await this.meterModel.findOne({ meterNumber: dto.meterNumber});

            if (!meter) {
                throw new NotFoundException("Meter not found.");
            }

            // Prevent meter re-assignment
            if (meter.isAssigned) {
                throw new BadRequestException("Meter has already been assigned.");
            }

            // Assign & activate
            meter.addressId = dto.addressId;
            meter.isAssigned = true;

            await meter.save();

            return {
                success: true,
                message: "Meter assigned to address successfully.",
                data: toResponseObject(meter)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // 🏠 Get meter attached to an address
    async getMeterByAddress(addressId: string) {
        try {
            // 1️⃣ Check if the address exists
            const address = await this.entryModel.findById(addressId);
            if (!address) {
            throw new NotFoundException('Address does not exist.');
            }

            // 2️⃣ Find the meter assigned to this address
            const meter = await this.meterModel.findOne({ addressId });

            if (!meter) {
            throw new NotFoundException('No meter is assigned to this address.');
            }

            // 3️⃣ Enrich with live vendor data
            const enrichedMeter = await this.enrichMeterWithVendorData(meter);

            // 4️⃣ Return clean response
            return {
            success: true,
            message: 'Meter retrieved successfully for this address.',
            data: enrichedMeter,
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to fetch meter by address.');
        }
    }

    // Update meter
    async updateMeter(id: string, dto: MeterDto) {
        try {
            // Check if the meter exist
            const meter = await this.meterModel.findById(id);

            if (!meter) {
                throw new NotFoundException('Meter not found.');
            }

            // Merge update locally
            Object.assign(meter, dto);

            // Sync with the vendor
            try {
                const token = await this.getVendorAuthToken();
                await this.updateMeterOnVendor(meter.meterNumber, dto, token);
            } catch (error) {
                throw new BadRequestException(error.message);
            }

            await meter.save();

            return {
                success: true,
                message: 'Meter updated successfully.'
            }

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // Trial vend (now deducts wallet)
    async trialVend(dto: VendPowerDto) {
        try {
            // 1️⃣ Debit wallet before calling vendor
            const wallet = await this.walletModel.findById(dto.walletId);

            if (!wallet) {
                throw new BadRequestException('Wallet not found.');
            }

            await this.transaction.createTransaction({
                walletId: dto.walletId,
                userId: wallet.userId, // ✅ Automatically pulled from wallet
                type: 'debit',
                amount: dto.amount,
                description: `Trial vend for meter ${dto.meterNumber}`,
            });


            const token = await this.getVendorAuthToken();
            const seed = Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
            const transId = uuid().replace(/-/g, '').slice(0, 16);

            const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;
            const derivedKey = SignatureUtil.deriveKey(STS_USER!, STS_PASS!, STS_KEY!, seed);

            const payload = {
                version: 1,
                clientId: STS_CLIENT_ID!,
                terminalId: STS_TERMINAL_ID!,
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

            const { data } = await firstValueFrom(
                this.http.post(`${this.baseUrl}/trialCreditVend`, body, { headers: {"Content-Type": "application/json"} })
            );

            if (!data || data.state !== 0) {
                const wallet = await this.walletModel.findById(dto.walletId);

                if (!wallet) {
                    throw new BadRequestException('Wallet not found.');
                }

                await this.transaction.createTransaction({
                    walletId: dto.walletId,
                    userId: wallet.userId, // ✅ Automatically pulled from wallet
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

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // Vend
    async vend(dto: VendPowerDto, transId: string) {
        try {
            const token = await this.getVendorAuthToken();
            const seed = String(Date.now()).padStart(16, '0');
            const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;

            // ✅ Correct 4-argument call
            const derivedKey = SignatureUtil.deriveKey(STS_USER!, STS_PASS!, STS_KEY!, seed);
    
            const payload = {
                version: "1",
                clientId: STS_CLIENT_ID!,
                terminalId: STS_TERMINAL_ID!,
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
    
            const { data } = await firstValueFrom(
                this.http.post(`${this.baseUrl}/creditVend`, body),
            );


    
            if (data.state !== 0) {
                throw new BadRequestException(data.message || 'Vend failed.');
            }
    
            // recommended: save vend details locally
            // await this.meterReadingModel.create({
            //     meterNumber: dto.meterNumber,
            //     receivedToken: data.energyList?.[0]?.token ?? null,
            //     amount: dto.amount,
            //     transId,
            // });
    
            return {
                success: true,
                message: 'Vend successful.',
                data,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // Toggle meter status
    async toggleMeterStatus(meterNumber: string, isActive: boolean) {
        try {
            const meter = await this.meterModel.findOne({ meterNumber });
            if (!meter) throw new BadRequestException('Meter not found.');

            // Update status locally
            meter.isActive = isActive;
            await meter.save();

            // Optional: Sync with vendor side
            const token = await this.getVendorAuthToken();

            if (!isActive) {
            await this.disconnectMeter(meterNumber);
            this.logger.log(`Meter ${meterNumber} deactivated and disconnected.`);
            } else {
            await this.reconnectMeter(meterNumber);
            this.logger.log(`Meter ${meterNumber} reactivated and reconnected.`);
            }

            return {
            success: true,
            message: `Meter ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: toResponseObject(meter),
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Unable to toggle meter status.');
        }
    }


    private async lookupMeterFromMerchant(meterNumber: string) {
        try {
            // Step 1: Get auth token
            const token = await this.getVendorAuthToken();

            // Step 2: Generate seed (16 digits)
            const seed = Math.floor(Math.random() * 1e16).toString().padStart(16, '0');

            const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;

            // Step 3: Correct key derivation (4-argument merchant algorithm)
            const derivedKey = SignatureUtil.deriveKey(STS_USER!, STS_PASS!, STS_KEY!, seed);

            // Step 4: Build payload exactly like merchant sample
            const payload = {
                version: 1,
                clientId: STS_CLIENT_ID!,
                terminalId: STS_TERMINAL_ID!,
                tokenName: "Authorization",
                tokenValue: token,
                requestTime: this.formatLocalDateTime(), // <-- Must be UTC yyyy-MM-dd HH:mm:ss
                seed,
                value: meterNumber, // <-- DO NOT modify, keep exactly as user entered
            };

            // Step 5: Generate signature
            const sign = SignatureUtil.generateSignature(payload, derivedKey);

            // Step 6: Append signature fields
            const body = { ...payload, sign, signType: "MD5" };

            this.logger.debug("🧾 CustomerDetails Payload:", JSON.stringify(body, null, 2));

            const { data } = await firstValueFrom(
            this.http.post(`${this.baseUrl}/customerDetails`, body, {
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                },
            })
            );

            this.logger.debug("📩 CustomerDetails Response:", data);

            if (!data || data.state !== 0) {
            throw new BadRequestException(data?.message || "Meter lookup failed.");
            }

            return data;
        } catch (error) {
            this.logger.error("❌ lookupMeterFromMerchant Error:", error);
            throw new BadRequestException(error.message);
        }
    }


    private async enrichMeterWithVendorData(meter: any) {
        try {
            const vendorData = await this.lookupMeterFromMerchant(meter.meterNumber);

            return {
                ...toResponseObject(meter), // local DB fields
                vendorData: {              // vendor system live fields
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
        } catch {
            // If merchant lookup fails, still return local data
            return {
                ...toResponseObject(meter),
                vendorData: null,
            };
        }
    }



    // 🏠 Get all meters by Estate ID (with pagination)
    async getMetersByEstateId(estateId: string, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const [meters, total] = await Promise.all([
                this.meterModel.find({ estateId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
                this.meterModel.countDocuments({ estateId }),
            ]);

            if (!meters.length) {
                throw new NotFoundException('No meters found for this estate.');
            }

            const enrichedMeters = await Promise.all(
                meters.map((meter) => this.enrichMeterWithVendorData(meter))
            );

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
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to fetch meters by estate.');
        }
    }


    // Get Meter by id
    async getMeter(id: string) {
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
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    private async getVendorAuthToken(): Promise<string> {
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

        // ✅ CORRECT final key
        const key = SignatureUtil.deriveKey(STS_USER!, STS_PASS!, STS_KEY!, seed);

        const sign = SignatureUtil.generateSignature(payload, key);
        const body = { ...payload, sign, signType: 'MD5' };

        this.logger.debug('🧾 Auth Payload JSON:', JSON.stringify(body, null, 2));
        this.logger.debug(`🌍 API Endpoint: ${this.baseUrl}/authToken`);

        const { data, status } = await firstValueFrom(
            this.http.post(`${this.baseUrl}/authToken`, body, {
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            validateStatus: () => true,
            }),
        );

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


    // ⚙️ Verify meter with vendor (FIXED requestTime + value field)
    private async verifyMeterWithVendor(meterNumber: string, token: string) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;

        // ✅ Correct 4-argument call
        const derivedKey = SignatureUtil.deriveKey(STS_USER!, STS_PASS!, STS_KEY!, seed);

        const payload = {
            version: "1",
            clientId: STS_CLIENT_ID!,
            terminalId: STS_TERMINAL_ID!,
            tokenName: 'Authorization',
            tokenValue: token,
            requestTime: this.formatLocalDateTime(),
            device: meterNumber, // ✅ correct field per merchant spec
            seed,
        };

        const sign = SignatureUtil.generateSignature(payload, derivedKey).toUpperCase();
        const body = { ...payload, sign, signType: 'MD5' };

        const { data } = await firstValueFrom(
            this.http.post(`${this.baseUrl}/customerDetails`, body)
        );

        return data.state === 0 ? data : null;
    }


   // 🧩 Register new meter with vendor (addCustomer API)
    private async registerMeterWithVendor(dto: MeterDto, token: string) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;

            // ✅ Correct 4-argument call
            const derivedKey = SignatureUtil.deriveKey(STS_USER!, STS_PASS!, STS_KEY!, seed);

        const payload = {
            version: "1",
            clientId: STS_CLIENT_ID!,
            terminalId: STS_TERMINAL_ID!,
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

        const { data } = await firstValueFrom(
            this.http.post(`${this.baseUrl}/addCustomer`, body),
        );

        if (data.state !== 0) {
            throw new BadRequestException(`Vendor registration failed: ${data.message}`);
        }

        return data;
    }

    // 🔄 Update meter info with vendor (optional)
    private async updateMeterOnVendor(meterNumber: string, dto: Partial<MeterDto>, token: string) {
        const seed = String(Date.now()).padStart(16, '0');
        const { STS_CLIENT_ID, STS_TERMINAL_ID, STS_USER, STS_PASS, STS_KEY } = process.env;

        // ✅ Correct 4-argument call
        const derivedKey = SignatureUtil.deriveKey(STS_USER!, STS_PASS!, STS_KEY!, seed);

        const payload = {
            version: "1",
            clientId: STS_CLIENT_ID!,
            terminalId: STS_TERMINAL_ID!,
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

        const { data } = await firstValueFrom(
            this.http.post(`${this.baseUrl}/updateCustomer`, body),
        );

        if (data.state !== 0) {
            throw new BadRequestException(`Vendor update failed: ${data.message}`);
        }

        return data;
    }


    private async disconnectMeter(meterNo: string) {
        try {
            await firstValueFrom(this.http.post(`${this.baseUrl}/disconnect`, { meterNo }));
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    private async reconnectMeter(meterNo: string) {
        try {
            await firstValueFrom(this.http.post(`${this.baseUrl}/reconnect`, { meterNo }));
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    private formatLocalDateTime(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

}
