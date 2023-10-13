import { CreateUserDto } from "./../auth/dto/create-user.dto";
import {
  Controller,
  UseGuards,
  Get,
  HttpStatus,
  Query,
  Body,
  Post,
  Delete,
  Param,
} from "@nestjs/common";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { AdminService } from "./admin.service";
import {
  ApiResponseWithData,
  ApiResponseWithoutData,
} from "src/common/api-response.common";
import { FilterDto } from "./dto/filter.dto";
import mongoose from "mongoose";
import { HttpException } from "@nestjs/common/exceptions/http.exception";

@UseGuards(JwtGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("recently-logged-in-users")
  async getRecentlyLoggedInUsers() {
    const userList = await this.adminService.getRecentlyLoggedInUsersList();
    return new ApiResponseWithData(HttpStatus.OK, "User-List", userList);
  }

  @Get("users-except-logged-in-users")
  async getUsersExceptLoggedInUsers(
    @Query()
    dto: FilterDto,
  ) {
    const userList =
      await this.adminService.getUsersExceptLoggedInUsersList(dto);
    return new ApiResponseWithData(HttpStatus.OK, "User-List", userList);
  }

  @Get("get-users-by-role")
  async getUserListByRole(
    @Query()
    dto?: {
      role: string;
    },
  ) {
    const userList = await this.adminService.getUsersByRole(dto.role);
    return userList;
  }

  @Get("get-filtered-users")
  async getFilteredUserList(
    @Query()
    dto: FilterDto,
  ) {
    const userList = await this.adminService.getAllFilteredUsers(dto);
    return userList;
  }

  @Get("users-created-per-day-in-seven-day")
  async getPerDayUserCountCreatedInLastSevenDays() {
    const userList =
      await this.adminService.getPerDayUsersCreatedInLastSevenDays();
    return userList;
  }

  @Get("users-logged-in-per-day-in-seven-day")
  async getPerDayUserCountLoggedInInLastSevenDays() {
    const userList =
      await this.adminService.getPerDayUserLoggedInInLastSevenDays();
    return userList;
  }

  @Post("add-user")
  async addUser(
    @Body()
    dto: CreateUserDto,
  ) {
    const user = await this.adminService.addNewUser(dto);
    return new ApiResponseWithData(
      HttpStatus.CREATED,
      "User Created Successfully",
      user,
    );
  }

  @Delete("delete-user/:userId")
  async deleteUser(
    @Param("userId")
    userId: mongoose.Types.ObjectId,
  ) {
    const result = await this.adminService.deleteUserDetails(userId);
    if (!result) {
      throw new HttpException("User Not Found", HttpStatus.BAD_REQUEST);
    } else {
      return new ApiResponseWithoutData(
        HttpStatus.OK,
        "User Deleted Successfully",
      );
    }
  }
}
