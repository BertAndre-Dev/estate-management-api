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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillsMgtService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wallet_schema_1 = require("../../schema/wallet.schema");
const bill_schema_1 = require("../../schema/bill-mgt/bill.schema");
const transform_util_1 = require("../../common/utils/transform.util");
const resident_bill_schema_1 = require("../../schema/bill-mgt/resident-bill.schema");
const transaction_mgt_service_1 = require("../transaction-mgt/transaction-mgt.service");
const date_fns_1 = require("date-fns");
const user_schema_1 = require("../../schema/user.schema");
let BillsMgtService = class BillsMgtService {
    billModel;
    walletModel;
    userModel;
    residentBillModel;
    transactionMgt;
    constructor(billModel, walletModel, userModel, residentBillModel, transactionMgt) {
        this.billModel = billModel;
        this.walletModel = walletModel;
        this.userModel = userModel;
        this.residentBillModel = residentBillModel;
        this.transactionMgt = transactionMgt;
    }
    async createBill(dto) {
        try {
            const normalizedName = dto.name.trim().toLowerCase();
            const existingBill = await this.billModel.findOne({
                estateId: dto.estateId,
                name: normalizedName,
            });
            if (existingBill) {
                throw new common_1.BadRequestException("A bill with this name already exists for this estate.");
            }
            const bill = new this.billModel({
                ...dto,
                name: normalizedName,
            });
            const savedBill = await bill.save();
            return {
                success: true,
                message: "Bill created successfully.",
                data: (0, transform_util_1.toResponseObject)(savedBill),
            };
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException("Duplicate bill name detected.");
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getBillsByEstate(estateId, page = 1, limit = 10) {
        try {
            if (!estateId || typeof estateId !== 'string') {
                throw new common_1.BadRequestException('A valid estateId is required.');
            }
            const skip = (page - 1) * limit;
            const query = { estateId: estateId.trim() };
            const [bills, total] = await Promise.all([
                this.billModel
                    .find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.billModel.countDocuments(query),
            ]);
            return {
                success: true,
                message: bills.length
                    ? 'Estate bills retrieved successfully.'
                    : 'No bills found for this estate.',
                data: (0, transform_util_1.toResponseObject)(bills),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit) || 1,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getBill(billId) {
        try {
            const bill = await this.billModel.findById(billId);
            if (!bill) {
                throw new common_1.NotFoundException("Bill not found.");
            }
            return {
                success: true,
                message: "Bill retrieved successfully.",
                data: (0, transform_util_1.toResponseObject)(bill)
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateBill(billId, dto) {
        try {
            const bill = await this.billModel.findById(billId);
            if (!bill) {
                throw new common_1.NotFoundException("Bill not found.");
            }
            bill.set({
                ...dto
            });
            await bill.save();
            return {
                success: true,
                message: "Bill updated successfully."
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteBill(billId) {
        try {
            const bill = await this.billModel.findByIdAndDelete(billId);
            if (!bill) {
                throw new common_1.NotFoundException("Bill not found.");
            }
            return {
                success: true,
                message: "Bill deleted successfully."
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async suspendBill(id) {
        try {
            const suspendBill = await this.billModel.findById(id);
            if (!suspendBill) {
                throw new common_1.NotFoundException("bill not found.");
            }
            if (!suspendBill.isActive) {
                throw new common_1.BadRequestException("bill is already suspended.");
            }
            suspendBill.isActive = false;
            await suspendBill.save();
            return {
                success: true,
                message: "Bill suspended successfully."
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async activateBill(id) {
        try {
            const activateBill = await this.billModel.findById(id);
            if (!activateBill) {
                throw new common_1.NotFoundException("Bill not found.");
            }
            if (activateBill.isActive) {
                throw new common_1.BadRequestException("Bill is already active.");
            }
            activateBill.isActive = true;
            await activateBill.save();
            return {
                success: true,
                message: "Bill activated successfully."
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async payBill(dto) {
        try {
            const bill = await this.billModel.findById(dto.billId);
            if (!bill) {
                throw new common_1.NotFoundException("Bill not found.");
            }
            const wallet = await this.walletModel.findById(dto.walletId);
            if (!wallet) {
                throw new common_1.NotFoundException("Wallet not found.");
            }
            let amount;
            if (dto.frequency === 'monthly') {
                amount = bill.yearlyAmount / 12;
            }
            else if (dto.frequency === 'quarterly') {
                amount = bill.yearlyAmount / 4;
            }
            else {
                amount = bill.yearlyAmount;
            }
            if (wallet.balance < amount) {
                throw new common_1.BadRequestException("Insufficient wallet balance. Top up your wallet.");
            }
            let residentBill = await this.residentBillModel.findOne({
                userId: dto.userId,
                billId: dto.billId
            });
            const today = new Date();
            if (residentBill && residentBill.nextDueDate) {
                const nextDue = new Date(residentBill.nextDueDate);
                const daysDiff = (nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                if (daysDiff > 5) {
                    throw new common_1.BadRequestException(`You can only renew this bill 5 days before the next due date. Next due date is ${nextDue.toDateString()}.`);
                }
            }
            const transactionDto = {
                walletId: dto.walletId,
                type: 'debit',
                amount: amount,
                description: `Payment for ${bill.name} (${dto.frequency})`,
                userId: dto.userId,
            };
            const transactionResult = await this.transactionMgt.createTransaction(transactionDto);
            if (!transactionResult.success === true) {
                throw new common_1.BadRequestException('Transaction failed, try again.');
            }
            const transactionId = transactionResult.data?.tx_ref;
            const paymentDate = new Date();
            let nextDueDate;
            if (dto.frequency === 'monthly') {
                nextDueDate = (0, date_fns_1.addMonths)(paymentDate, 1);
            }
            else if (dto.frequency === 'quarterly') {
                nextDueDate = (0, date_fns_1.addMonths)(paymentDate, 3);
            }
            else {
                nextDueDate = (0, date_fns_1.addMonths)(paymentDate, 12);
            }
            if (residentBill) {
                residentBill.lastPaymentDate = paymentDate;
                residentBill.nextDueDate = nextDueDate;
                residentBill.status = 'active';
                residentBill.amountPaid = amount;
                await residentBill.save();
            }
            else {
                residentBill = await this.residentBillModel.create({
                    userId: dto.userId,
                    billId: dto.billId,
                    transactionId,
                    frequency: dto.frequency,
                    amountPaid: amount,
                    startDate: paymentDate,
                    nextDueDate: nextDueDate,
                    status: 'active',
                });
            }
            if (bill.isServiceCharge === true) {
                await this.userModel.findByIdAndUpdate(dto.userId, { $set: { serviceCharge: true } }, { new: true });
            }
            return {
                success: true,
                message: `Payment for ${bill.name} successful`,
                data: {
                    bill,
                    transaction: (0, transform_util_1.toResponseObject)(transactionResult.data),
                    nextDueDate
                }
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getResidentBills(userId) {
        try {
            const residentBills = await this.residentBillModel
                .find({ userId })
                .sort({ createdAt: -1 });
            const enrichedBills = await Promise.all(residentBills.map(async (rb) => {
                const bill = await this.billModel.findById(rb.billId);
                return {
                    _id: rb._id,
                    userId: rb.userId,
                    billId: rb.billId,
                    billName: bill?.name || "Unknown Bill",
                    frequency: rb.frequency,
                    amountPaid: rb.amountPaid,
                    startDate: rb.startDate,
                    nextDueDate: rb.nextDueDate,
                    status: rb.status,
                    lastPaymentDate: rb.lastPaymentDate
                };
            }));
            return {
                success: true,
                message: "Resident bills retrieved successfully.",
                data: enrichedBills,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.BillsMgtService = BillsMgtService;
exports.BillsMgtService = BillsMgtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __param(1, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(resident_bill_schema_1.ResidentBill.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        transaction_mgt_service_1.TransactionMgtService])
], BillsMgtService);
//# sourceMappingURL=bills-mgt.service.js.map