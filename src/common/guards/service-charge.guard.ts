import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Role } from '../enum/roles.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { Bill } from 'src/schema/bill-mgt/bill.schema';

@Injectable()
export class ServiceChargeGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Bill.name) private billModel: Model<Bill>,
  ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const user = await this.userModel.findById(req.user?.id);

        if (!user) throw new ForbiddenException('User not found.');

        // Allow non-residents
        if (user.role !== Role.RESIDENT) return true;

        // Already paid → Allow everything
        if (user.serviceCharge === true) return true;

        // Check if request contains a bill ID
        const billId = req.body?.billId;
        if (!billId) return true; // non-payment routes pass through

        const bill = await this.billModel.findById(billId);
        if (!bill) throw new ForbiddenException('Bill not found.');

        // ✅ This is the ONLY bill allowed before serviceCharge is paid
        if (bill.isServiceCharge === true) return true;

        throw new ForbiddenException(
            'You must pay your service charge before paying for other bills.',
        );
    }

}
