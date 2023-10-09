import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";
import { User } from "./schema/user.schema";
import { EditUserDto } from "./dto/edit-user.dto";

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
