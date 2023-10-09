import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Role {
  ADMIN = "Admin",
  EMPLOYEE = "Employee",
  SUPER_ADMIN = "Super-Admin",
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: Role.EMPLOYEE })
  role: Role;

  @Prop()
  profilePic: string;

  @Prop({ default: false })
  isLoggedIn: boolean;

  @Prop({ default: Date.now })
  loggedInTime: Date;

  @Prop({ default: "" })
  resetPasswordToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.toJSON = function () {
  const obj = this.toObject(); //or var obj = this;
  delete obj.password;
  return obj;
};
