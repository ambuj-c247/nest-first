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
import { ApiResponse } from "src/common/api-response.common";
import mongoose from "mongoose";
import { EditUserDto } from "./dto/edit-user.dto";

@UseGuards(JwtGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  getMe(@GetUser() user: object) {
    return user;
  }

  @Get("users")
  async users() {
    const userList = await this.userService.getUsers();
    return new ApiResponse(HttpStatus.OK, "Users List", userList);
  }

  @Patch("update")
  async updateUser(
    @GetUser("id") userId: mongoose.Schema.Types.ObjectId,
    @Body() dto: EditUserDto,
  ) {
    const updatedUser = await this.userService.updateUsers(userId, dto);
    return new ApiResponse(
      HttpStatus.OK,
      "Details Updated Successfully",
      updatedUser,
    );
  }

  @Patch("logout")
  async logout(@GetUser("id") userId: mongoose.Schema.Types.ObjectId) {
    const result = await this.userService.logOut(userId);
    return new ApiResponse(HttpStatus.OK, "Logged Out Successfully", result);
  }
  //   @Delete("users")
  //   async delete() {
  //     const userList = await this.userService.deleteUser();
  //     return new ApiResponse(HttpStatus.OK, "Users List", userList);
  //   }
}
