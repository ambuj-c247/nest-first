/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenException, Injectable, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../user/schema/user.schema";
import * as bcrypt from "bcrypt";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { Login } from "src/user/schema/login.schema";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { randomBytes } from "crypto";
import { ApiResponseWithoutData } from "src/common/api-response.common";
import { ResetPasswordDto } from "./dto/reset-password.dto";
// import { ConfigService } from "@nestjs/config";
// import { IsEmailUniqueValidator } from "src/validators/is-email-unique.validator";

@Injectable({})
export class AuthService {
  constructor(
    // Dependency Injections
    private jwt: JwtService,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Login.name)
    private loginModel: mongoose.Model<Login>,
  ) {}

  async isUniqueEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async signup(user: User) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    const newUser = await this.userModel.create({ ...user, password: hash });
    return newUser;
  }

  async login(dto: AuthDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException("Wrong Credentials");
    // compare password
    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) throw new ForbiddenException("Wrong Credentials");
    user.isLoggedIn = true;
    // user.loggedInTime = Date.now();
    await user.save();

    // Now we are checking if this user's login details for current day is saved in login table or not.

    // get current day date and time from mid night
    const start_of_day = new Date();
    start_of_day.setHours(0, 0, 0, 0);
    const currentTime = new Date();
    const userId = user._id;
    let loginEntry: object;

    const existingLoginEntry = await this.loginModel.findOne({
      userId,
      loginDate: {
        $gte: start_of_day,
        $lte: currentTime,
      },
    });
    // if login details exists increase the login count or if not make an entry to the login table
    if (existingLoginEntry) {
      existingLoginEntry.loginCount++;
      loginEntry = await existingLoginEntry.save();
    } else {
      loginEntry = await this.loginModel.create({
        userId,
        loginDate: Date.now(),
        loginCount: 1,
      });
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: mongoose.Types.ObjectId,
    email: string,
  ): Promise<{ userId: mongoose.Types.ObjectId; access_token: string }> {
    const payload = {
      userId,
      email,
    };
    const secret = process.env.JWT_SECRET;

    const token = await this.jwt.signAsync(payload, {
      expiresIn: "1d",
      secret: secret,
    });

    return {
      userId: userId,
      access_token: token,
    };
  }

  async forgetPassword(dto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new ApiResponseWithoutData(
        HttpStatus.BAD_REQUEST,
        "User Not found,Please Enter valid email.",
      );
    } else {
      const token = randomBytes(48).toString("hex");
      user.resetPasswordToken = token;
      await user.save();
      return user;
    }

    // lets send email and a token in the mail body so we can verify that user has clicked right link
    // if (email) {
    //   const response = await userPasswordReset({
    //     to: email,
    //     token,
    //     username: user?.fullName,
    //   });
    //   return response;
    //   // res.status(200).json({statusCode: 200, message: "Reset Link sent to your email!"});
    // } else {
    //   throw { statusCode: 400 };
    //   // res.sendStatus(400);
    // }
  }

  async userResetPassword(dto: ResetPasswordDto) {
    const { email, newPassword, token } = dto;
    const user = await this.userModel.findOne({
      email: email,
      resetPasswordToken: token,
    });

    if (!user) {
      throw {
        statusCode: 401,
        message: "Link Has expired Please try again and send new link",
      };
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(dto.newPassword, salt);
      user.password = hash;
      user.resetPasswordToken = "";
      await user.save();

      // if (email) {
      //   const response = await userPasswordResetSuccess({
      //     to: email,
      //     username: user?.fullName,
      //   });
      return true;
      // } else {
      //   throw { statusCode: 400 };
      //   // res.sendStatus(400);
      // }
    }
  }
}
