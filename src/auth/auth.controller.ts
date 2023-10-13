import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
// import { InjectModel } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthDto } from "./dto/auth.dto";
import {
  ApiResponseWithData,
  ApiResponseWithoutData,
} from "src/common/api-response.common";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

// 'auth' will be the common suffix of route
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(
    @Body()
    user: CreateUserDto,
  ) {
    const newUser = await this.authService.signup(user);
    delete newUser.password;
    return new ApiResponseWithData(
      HttpStatus.CREATED,
      "User Created Successfully",
      newUser,
    );
  }
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Body()
    dto: AuthDto,
  ) {
    const user = await this.authService.login(dto);
    return new ApiResponseWithData(
      HttpStatus.OK,
      "User logged In Successfully",
      user,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post("forget-password")
  async forgetPasswordRequest(
    @Body()
    dto: ForgetPasswordDto,
  ) {
    await this.authService.forgetPassword(dto);
    return new ApiResponseWithoutData(
      HttpStatus.OK,
      "Password Reset Link Send Successfully check your email",
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  async resetPassword(
    @Body()
    dto: ResetPasswordDto,
  ) {
    await this.authService.userResetPassword(dto);
    return new ApiResponseWithoutData(
      HttpStatus.OK,
      "Password reset Successfully",
    );
  }
}
