import {
  Controller,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  Patch,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { GetUser } from "../auth/decorator/get-user.decorator";
import { JwtGuard } from "../auth/guard/jwt.guard";
import {
  ApiResponseWithData,
  ApiResponseWithoutData,
} from "src/common/api-response.common";
import mongoose from "mongoose";
import { EditUserDto } from "./dto/edit-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { User } from "./schema/user.schema";

// Guards is basically a middleware which if user access-token is correct in this case
@UseGuards(JwtGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  getMe(@GetUser() user: object) {
    return new ApiResponseWithData(HttpStatus.OK, "Successful", user);
  }

  @Get("users")
  async users() {
    const userList = await this.userService.getUsers();
    return new ApiResponseWithData(HttpStatus.OK, "Users List", userList);
  }

  @Patch("update")
  async updateUser(
    @GetUser("id") userId: mongoose.Schema.Types.ObjectId,
    @Body() dto: EditUserDto,
  ) {
    const updatedUser = await this.userService.updateUsers(userId, dto);
    return new ApiResponseWithData(
      HttpStatus.OK,
      "Details Updated Successfully",
      updatedUser,
    );
  }

  @Patch("update-password")
  async changePassword(@GetUser() user: User, @Body() dto: UpdatePasswordDto) {
    const response = await this.userService.updatePassword(user, dto);
    if (response) {
      return new ApiResponseWithoutData(
        HttpStatus.OK,
        "Password Updated Successfully",
      );
    }
  }

  @Patch("logout")
  async logout(@GetUser("id") userId: mongoose.Schema.Types.ObjectId) {
    await this.userService.logOut(userId);
    return new ApiResponseWithoutData(HttpStatus.OK, "Logged Out Successfully");
  }
  //   @Delete("users")
  //   async delete() {
  //     const userList = await this.userService.deleteUser();
  //     return new ApiResponseWithData(HttpStatus.OK, "Users List", userList);
  //   }
}
