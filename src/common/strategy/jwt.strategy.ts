import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Model } from "mongoose";
import { Role } from "src/common/enum/roles.enum";
import { User } from "src/schema/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: string; role: Role }) {
    const { sub: userId, role } = payload;

    // 🔎 find the user by ID
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // ✅ Optional: ensure the JWT role matches the DB role
    if (role && user.role !== role) {
      throw new UnauthorizedException("Invalid user role");
    }

    return user;
  }
}
