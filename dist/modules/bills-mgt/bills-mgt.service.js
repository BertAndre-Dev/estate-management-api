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
import { Injectable, BadRequestException, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from "../../schema/wallet.schema";
import { Bill } from "../../schema/bill-mgt/bill.schema";
import { toResponseObject } from "../../common/utils/transform.util";
import { ResidentBill } from "../../schema/bill-mgt/resident-bill.schema";
import { TransactionMgtService } from '../transaction-mgt/transaction-mgt.service';
import { addMonths } from 'date-fns';
import { User } from "../../schema/user.schema";
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
                throw new BadRequestException("A bill with this name already exists for this estate.");
            }
            const bill = new this.billModel({
                ...dto,
                name: normalizedName,
            });
            const savedBill = await bill.save();
            return {
                success: true,
                message: "Bill created successfully.",
                data: toResponseObject(savedBill),
            };
        }
        catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException("Duplicate bill name detected.");
            }
            throw new BadRequestException(error.message);
        }
    }
    async getBillsByEstate(estateId, page = 1, limit = 10) {
        try {
            if (!estateId || typeof estateId !== 'string') {
                throw new BadRequestException('A valid estateId is required.');
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
                data: toResponseObject(bills),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit) || 1,
                },
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async getBill(billId) {
        try {
            const bill = await this.billModel.findById(billId);
            if (!bill) {
                throw new NotFoundException("Bill not found.");
            }
            return {
                success: true,
                message: "Bill retrieved successfully.",
                data: toResponseObject(bill)
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async updateBill(billId, dto) {
        try {
            const bill = await this.billModel.findById(billId);
            if (!bill) {
                throw new NotFoundException("Bill not found.");
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
            throw new BadRequestException(error.message);
        }
    }
    async deleteBill(billId) {
        try {
            const bill = await this.billModel.findByIdAndDelete(billId);
            if (!bill) {
                throw new NotFoundException("Bill not found.");
            }
            return {
                success: true,
                message: "Bill deleted successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async suspendBill(id) {
        try {
            const suspendBill = await this.billModel.findById(id);
            if (!suspendBill) {
                throw new NotFoundException("bill not found.");
            }
            if (!suspendBill.isActive) {
                throw new BadRequestException("bill is already suspended.");
            }
            suspendBill.isActive = false;
            await suspendBill.save();
            return {
                success: true,
                message: "Bill suspended successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async activateBill(id) {
        try {
            const activateBill = await this.billModel.findById(id);
            if (!activateBill) {
                throw new NotFoundException("Bill not found.");
            }
            if (activateBill.isActive) {
                throw new BadRequestException("Bill is already active.");
            }
            activateBill.isActive = true;
            await activateBill.save();
            return {
                success: true,
                message: "Bill activated successfully."
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async payBill(dto) {
        try {
            const bill = await this.billModel.findById(dto.billId);
            if (!bill) {
                throw new NotFoundException("Bill not found.");
            }
            const wallet = await this.walletModel.findById(dto.walletId);
            if (!wallet) {
                throw new NotFoundException("Wallet not found.");
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
                throw new BadRequestException("Insufficient wallet balance. Top up your wallet.");
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
                    throw new BadRequestException(`You can only renew this bill 5 days before the next due date. Next due date is ${nextDue.toDateString()}.`);
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
                throw new BadRequestException('Transaction failed, try again.');
            }
            const transactionId = transactionResult.data?.tx_ref;
            const paymentDate = new Date();
            let nextDueDate;
            if (dto.frequency === 'monthly') {
                nextDueDate = addMonths(paymentDate, 1);
            }
            else if (dto.frequency === 'quarterly') {
                nextDueDate = addMonths(paymentDate, 3);
            }
            else {
                nextDueDate = addMonths(paymentDate, 12);
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
                    transaction: toResponseObject(transactionResult.data),
                    nextDueDate
                }
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
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
            throw new BadRequestException(error.message);
        }
    }
};
BillsMgtService = __decorate([
    Injectable(),
    __param(0, InjectModel(Bill.name)),
    __param(1, InjectModel(Wallet.name)),
    __param(2, InjectModel(User.name)),
    __param(3, InjectModel(ResidentBill.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model,
        Model,
        TransactionMgtService])
], BillsMgtService);
export { BillsMgtService };
//# sourceMappingURL=bills-mgt.service.js.map