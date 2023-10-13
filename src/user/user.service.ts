import { InjectModel } from "@nestjs/mongoose";
import { Injectable, ForbiddenException } from "@nestjs/common";
import mongoose from "mongoose";
import { User } from "./schema/user.schema";
import { EditUserDto } from "./dto/edit-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async getUsers() {
    const users = await this.userModel.find({}, "-password");
    return users;
  }

  async updateUsers(userId: mongoose.Schema.Types.ObjectId, dto: EditUserDto) {
    console.log(userId, dto);
    const user = await this.userModel.findByIdAndUpdate(userId, dto, {
      new: true,
    });
    return user;
  }

  async updatePassword(user: User, dto: UpdatePasswordDto) {
    console.log(user, dto);
    const isPasswordMatch = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordMatch)
      throw new ForbiddenException("Please provide right old password.");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.newPassword, salt);
    const res = await this.userModel.findOneAndUpdate(
      { email: user.email },
      { password: hash },
    );
    return res;
  }

  async logOut(userId: mongoose.Schema.Types.ObjectId) {
    const result = await this.userModel.findByIdAndUpdate(userId, {
      isLoggedIn: false,
    });
    return result;
  }

  async deleteUser(userId: mongoose.Schema.Types.ObjectId) {
    const result = await this.userModel.deleteOne(userId);
    return result;
  }
}
