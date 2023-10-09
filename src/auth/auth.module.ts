import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/schema/user.schema";
import { IsEmailUniqueValidator } from "src/validators/is-email-unique.validator";
import { JwtStrategy } from "./strategy";
import { JwtModule } from "@nestjs/jwt";
import { LoginSchema } from "src/user/schema/login.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Login", schema: LoginSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, IsEmailUniqueValidator, JwtStrategy],
})
export class AuthModule {}
