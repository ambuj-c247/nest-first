import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { IsMatches } from "src/validators/is-match.validator";
import { IsStrongPassword } from "src/validators/is-password-strong";

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(6, 30, {
    message:
      "The password must be at least 6 but not longer than 30 characters",
  })
  @IsNotEmpty({ message: "The newPassword is required" })
  @IsStrongPassword()
  newPassword: string;

  @IsNotEmpty({ message: "The confirm password is required" })
  @IsMatches("newPassword", {
    message: "confirmPassword do not match with password",
  })
  confirmPassword: string;

  @IsNotEmpty({ message: "The token is required" })
  token: string;
}
