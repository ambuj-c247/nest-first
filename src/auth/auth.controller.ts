import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
// import { InjectModel } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthDto } from "./dto/auth.dto";
import { ApiResponse } from "src/common/api-response.common";

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
    return new ApiResponse(
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
    return new ApiResponse(HttpStatus.OK, "User logged In Successfully", user);
  }
}
