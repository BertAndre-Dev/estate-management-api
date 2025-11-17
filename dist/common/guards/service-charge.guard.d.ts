import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { Bill } from 'src/schema/bill-mgt/bill.schema';
export declare class ServiceChargeGuard implements CanActivate {
    private userModel;
    private billModel;
    constructor(userModel: Model<User>, billModel: Model<Bill>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
