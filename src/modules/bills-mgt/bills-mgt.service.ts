import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBillDto } from 'src/dto/bill-dto/create-bill.dto';
import { CreateTransactionDto } from 'src/dto/transaction.dto';
import { BillPaymentDto } from 'src/dto/bill-dto/bill-payment.dto';
import { Wallet, WalletDocument } from 'src/schema/wallet.schema';
import { Bill, BillDocument } from 'src/schema/bill-mgt/bill.schema';
import { toResponseObject } from 'src/common/utils/transform.util';
import { ResidentBill, ResidentBillDocument } from 'src/schema/bill-mgt/resident-bill.schema';
import { TransactionMgtService } from '../transaction-mgt/transaction-mgt.service';
import { addMonths } from 'date-fns';
import { User, UserDocument } from 'src/schema/user.schema';


@Injectable()
export class BillsMgtService {
    constructor(
        @InjectModel(Bill.name) private billModel: Model<BillDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(ResidentBill.name) private residentBillModel: Model<ResidentBillDocument>,
        private readonly transactionMgt: TransactionMgtService,
    ){}


    // create a bill
    async createBill(dto: CreateBillDto) {
        try {
            // Trim and convert bill name to lowercase
            const normalizedName = dto.name.trim().toLowerCase();

            // Check if the bill with the same name already exists for the estate
            const existingBill = await this.billModel.findOne({
            estateId: dto.estateId,
            name: normalizedName, // Direct lowercase match
            });

            if (existingBill) {
            throw new BadRequestException("A bill with this name already exists for this estate.");
            }

            // Create a new bill using lowercase name
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
        } catch (error) {
            if (error.code === 11000) {
            throw new BadRequestException("Duplicate bill name detected.");
            }
            throw new BadRequestException(error.message);
        }
    }


    // get all bills by estate
    // async getBillsByEstate(
    //     estateId: string, 
    //     page: number = 1, 
    //     limit: number = 10, 
    //     search?: string
    // ) {
    //     try {
    //         const query: any = { estateId };
    //         if (search) {
    //             query.name = { $regex: search, $options: 'i' }; // case-insensitive search
    //         }   
    //         const total = await this.billModel.countDocuments(query);
    //         const totalPages = Math.ceil(total / limit);
    //         const skip = (page - 1) * limit;    
    //         const bills = await this.billModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    //         return {
    //             success: true,  
    //             message: "Bills retrieved successfully.",
    //             data: toResponseObject(bills),
    //             pagination: {
    //                 total,
    //                 currentPage: page,
    //                 totalPages,
    //                 pageSize: limit,
    //             },
    //         }
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }   
    // }


    async getBillsByEstate(
        estateId: string,
        page = 1,
        limit = 10
    ) {
        try {
            if (!estateId || typeof estateId !== 'string') {
                throw new BadRequestException('A valid estateId is required.');
            }

            const skip = (page - 1) * limit;

            // Base query: filter by estateId
            const query: Record<string, any> = { estateId: estateId.trim() };

            // ✅ Super admin can see all users in the estate (no additional filter)
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
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // get bill
    async getBill(billId: string) {
        try {
            const bill = await this.billModel.findById(billId);

            // check if the bill exist
            if (!bill) {
                throw new NotFoundException("Bill not found.");
            }

            return {
                success: true,
                message: "Bill retrieved successfully.",
                data: toResponseObject(bill)
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // update bill 
    async updateBill(billId: string, dto: CreateBillDto) {
        try {
            const bill = await this.billModel.findById(billId);

            // check if the bill exist
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
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // delete bill
    async deleteBill(billId: string) {
        try {
            const bill = await this.billModel.findByIdAndDelete(billId);

            // check if the bill exist
            if (!bill) {
                throw new NotFoundException("Bill not found.");
            }

            return {
                success: true,
                message: "Bill deleted successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // suspend bill
    async suspendBill(id: string) {
        try {
            const suspendBill = await this.billModel.findById(id);
    
            // check if the bill exist
            if (!suspendBill) {
                throw new NotFoundException("bill not found.");
            }
    
            // check if the bill is suspended
            if (!suspendBill.isActive) {
                throw new BadRequestException("bill is already suspended.");
            }
    
            // suspend bill
            suspendBill.isActive = false;
    
            await suspendBill.save();
    
            return {
                success: true,
                message: "Bill suspended successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // activate bill
    async activateBill(id: string) {
        try {
            const activateBill = await this.billModel.findById(id);

            // check if the bill already exist
            if (!activateBill) {
                throw new NotFoundException("Bill not found.");
            }

            // check if the bill is active
            if (activateBill.isActive) {
                throw new BadRequestException("Bill is already active.");
            }

            // activate bill
            activateBill.isActive = true;

            await activateBill.save();

            return {
                success: true,
                message: "Bill activated successfully."
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // initialize bill payment
    async payBill(dto: BillPaymentDto) {
        try {
            // fetch the bill
            const bill = await this.billModel.findById(dto.billId);

            if (!bill) {
                throw new NotFoundException("Bill not found.");
            }

            // fetch wallet
            const wallet = await this.walletModel.findById(dto.walletId);
            if (!wallet) {
                throw new NotFoundException("Wallet not found.");
            }

            // calculate amount based on frequency
            let amount: number;
            if (dto.frequency === 'monthly') {
                amount = bill.yearlyAmount / 12;
            } else if (dto.frequency === 'quarterly') {
                amount = bill.yearlyAmount / 4;
            } else {
                amount = bill.yearlyAmount;
            }

            if (wallet.balance < amount) {
                throw new BadRequestException(
                    "Insufficient wallet balance. Top up your wallet."
                );
            }

            // find existing resident bill
            let residentBill = await this.residentBillModel.findOne({
                userId: dto.userId,
                billId: dto.billId
            });

            const today = new Date();

            // 🔥 PREVENT PAYMENT TOO EARLY
            if (residentBill && residentBill.nextDueDate) {
                const nextDue = new Date(residentBill.nextDueDate);

                // calculate number of days until next due date
                const daysDiff =
                    (nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

                // if daysLeft > 5 → payment not allowed
                if (daysDiff > 5) {
                    throw new BadRequestException(
                        `You can only renew this bill 5 days before the next due date. Next due date is ${nextDue.toDateString()}.`
                    );
                }
            }

            // ---------------------------
            // PAYMENT CAN CONTINUE BELOW
            // ---------------------------

            // record transaction (debit)
            const transactionDto: CreateTransactionDto = {
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

            // calculate next due date
            let nextDueDate: Date;
            if (dto.frequency === 'monthly') {
                nextDueDate = addMonths(paymentDate, 1);
            } else if (dto.frequency === 'quarterly') {
                nextDueDate = addMonths(paymentDate, 3);
            } else {
                nextDueDate = addMonths(paymentDate, 12);
            }

            if (residentBill) {
                // update existing bill record
                residentBill.lastPaymentDate = paymentDate;
                residentBill.nextDueDate = nextDueDate;
                residentBill.status = 'active';
                residentBill.amountPaid = amount;
                await residentBill.save();
            } else {
                // first-time payment
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

            // update service charge flag on user
            if (bill.isServiceCharge === true) {
                await this.userModel.findByIdAndUpdate(
                    dto.userId,
                    { $set: { serviceCharge: true } },
                    { new: true }
                );
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

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }



    // get resident's bill summary
    async getResidentBills(userId: string) {
        try {
            // Fetch all resident bill records
            const residentBills = await this.residentBillModel
            .find({ userId })
            .sort({ createdAt: -1 });

            // Map through bills and attach bill info (name, amount, etc.)
            const enrichedBills = await Promise.all(
            residentBills.map(async (rb) => {
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
            })
            );

            return {
            success: true,
            message: "Resident bills retrieved successfully.",
            data: enrichedBills,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}
