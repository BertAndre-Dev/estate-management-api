import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import { Role } from "src/common/enum/roles.enum";
import { User } from "src/schema/user.schema";
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userModel;
    constructor(config: ConfigService, userModel: Model<User>);
    validate(payload: {
        sub: string;
        role: Role;
    }): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
export {};
