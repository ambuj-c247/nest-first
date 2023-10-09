import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schema/user.schema";
import { LoginSchema } from "./schema/login.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Login", schema: LoginSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
