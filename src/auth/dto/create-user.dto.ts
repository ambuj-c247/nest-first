// import { IsEmailUniqueValidator } from "src/validators/is-email-unique.validator";
import { Role } from "../../user/schema/user.schema";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  Validate,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 20, {
    message:
      "The full name must be at least 6 but not longer than 20 characters",
  })
  readonly fullName: string;
  @IsEmail()
  @IsNotEmpty()
  //   @Validate(IsEmailUniqueValidator, {
  //     message: "Email must be unique.",
  //   })
  email: string;
  @Length(6, 30, {
    message:
      "The password must be at least 6 but not longer than 30 characters",
  })
  @IsNotEmpty({ message: "The password is required" })
  readonly password: string;
  @IsOptional()
  @IsString()
  readonly profilePic: string;
  readonly role: Role;
  readonly isLoggedIn: boolean;
  readonly loggedInTime: Date;
  readonly resetPasswordToken: string;
}
