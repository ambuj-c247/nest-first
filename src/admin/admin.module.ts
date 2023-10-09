import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/schema/user.schema";
import { LoginSchema } from "src/user/schema/login.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Login", schema: LoginSchema },
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
