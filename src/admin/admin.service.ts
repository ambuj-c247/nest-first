import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Login } from "src/user/schema/login.schema";
import { User } from "src/user/schema/user.schema";
import { FilterDto } from "./dto/filter.dto";
import { UserRole } from "src/common/constants/constant";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
// import { ApiResponseWithoutData } from "src/common/api-response.common";
import { HttpException } from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class AdminService {
  constructor(
    // Dependency Injections
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Login.name)
    private loginModel: mongoose.Model<Login>,
  ) {}

  async getRecentlyLoggedInUsersList() {
    const userList = await this.userModel
      .find({})
      .sort({ loggedInTime: -1 })
      .limit(20);
    return userList;
  }

  async getUsersExceptLoggedInUsersList(dto: FilterDto): Promise<any> {
    const {
      search: searchText,
      filterRole: filter,
      sort: sortField,
      order: sortOrder,
      role: userRole,
    } = dto;
    let query = this.userModel.find({ isLoggedIn: false });
    //  For finding total number of user for pagination
    let totalUsersQuery = this.userModel.find({ isLoggedIn: false });
    if (userRole) {
      if (userRole === UserRole.admin) {
        query = query.find({
          role: { $in: [UserRole.admin, UserRole.employee] },
        });
        totalUsersQuery = totalUsersQuery.find({
          role: { $in: [UserRole.admin, UserRole.employee] },
        });
      }
    }
    if (searchText) {
      query = query.find({
        $or: [
          { fullName: new RegExp(searchText, "i") },
          { email: new RegExp(searchText, "i") },
        ],
        role: UserRole.employee,
      });
      totalUsersQuery = totalUsersQuery.find({
        $or: [
          { fullName: new RegExp(searchText, "i") },
          { email: new RegExp(searchText, "i") },
        ],
        role: UserRole.employee,
      });
    }
    if (filter) {
      query = query.find({ isLoggedIn: false, role: filter });
      totalUsersQuery = totalUsersQuery.find({
        role: filter,
      });
    }
    if (sortField && sortOrder) {
      if (sortOrder === "ASC") {
        query = query.find({}).sort({ [sortField]: 1 });
        totalUsersQuery = totalUsersQuery.find({}).sort({ [sortField]: 1 });
      } else if (sortOrder === "DESC") {
        query = query.find({}).sort({ [sortField]: -1 });
        totalUsersQuery = totalUsersQuery.find({}).sort({ [sortField]: -1 });
      }
    }
    const totalUsers = await totalUsersQuery.count().exec();
    if (dto.page && dto.limit) {
      const pageSize = dto.limit;
      const page = dto.page;
      query = query
        .find({})
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    }
    const userList = await query.exec();
    return { userList, totalUsers };
  }

  async getUsersByRole(role: string): Promise<any> {
    let userList;
    if (role) {
      userList = await this.userModel
        .find({ role: role })
        .sort({ createdAt: -1 })
        .limit(5);
    } else {
      userList = await this.userModel.find().sort({ createdAt: -1 });
    }
    return userList;
  }

  async getAllFilteredUsers(dto: FilterDto): Promise<any> {
    let query = this.userModel
      .find({ isLoggedIn: false })
      .sort({ createdAt: -1 });
    //  For finding total number of user for pagination
    let totalUsersQuery = this.userModel.find({ isLoggedIn: false });
    if (dto.role) {
      query = query.find({ role: dto.role });

      totalUsersQuery = totalUsersQuery.find({ role: dto.role });
    }

    const totalUsers = await totalUsersQuery.count().exec();
    if (dto.page && dto.limit) {
      const pageSize = dto.limit;
      const page = dto.page;
      query = query
        .find({})
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    }
    const userList = await query.exec();
    return { userList, totalUsers };
  }

  async getPerDayUsersCreatedInLastSevenDays(): Promise<any> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sun" },
                { case: { $eq: ["$_id", 2] }, then: "Mon" },
                { case: { $eq: ["$_id", 3] }, then: "Tue" },
                { case: { $eq: ["$_id", 4] }, then: "Wed" },
                { case: { $eq: ["$_id", 5] }, then: "Thu" },
                { case: { $eq: ["$_id", 6] }, then: "Fri" },
                { case: { $eq: ["$_id", 7] }, then: "Sat" },
              ],
              default: "Unknown",
            },
          },
          total: 1,
        },
      },
    ];

    const userList = await this.userModel.aggregate(pipeline).exec();
    const dayOrder = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7,
    };

    // Sort the data array based on the dayOrder
    userList.sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
    return userList;
  }

  async getPerDayUserLoggedInInLastSevenDays() {
    // get the date 7 days prior to current date
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const pipeline = [
      {
        $match: {
          loginDate: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$loginDate" },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sun" },
                { case: { $eq: ["$_id", 2] }, then: "Mon" },
                { case: { $eq: ["$_id", 3] }, then: "Tue" },
                { case: { $eq: ["$_id", 4] }, then: "Wed" },
                { case: { $eq: ["$_id", 5] }, then: "Thu" },
                { case: { $eq: ["$_id", 6] }, then: "Fri" },
                { case: { $eq: ["$_id", 7] }, then: "Sat" },
              ],
              default: "Unknown",
            },
          },
          total: 1,
        },
      },
      //   {
      //     $sort: { day: 1 },
      //   },
    ];

    const userList = await this.loginModel.aggregate(pipeline);
    const dayOrder = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7,
    };

    // Sort the data array based on the dayOrder
    userList.sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
    return userList;
  }

  async deleteUserDetails(userId: mongoose.Types.ObjectId) {
    try {
      const result = await this.userModel.findByIdAndDelete(userId);
      return result;
    } catch (err) {
      if (err.name === "CastError" && err.kind === "ObjectId") {
        // Handle the CastError due to an invalid ObjectId here
        throw new HttpException("Invalid Id", HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException("something went wrong", HttpStatus.BAD_REQUEST);
      }
    }
  }
  //  add user in admin panel
  async addNewUser(dto: CreateUserDto) {
    console.log(dto);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);
    let user = new this.userModel({
      ...dto,
      password: hash,
    });
    user = await user.save();
    //   const { password, ...others } = user._doc;
    return user;
  }
}
