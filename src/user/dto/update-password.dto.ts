import { IsNotEmpty } from "class-validator";
import { IsStrongPassword } from "src/validators/is-password-strong";

export class UpdatePasswordDto {
  @IsNotEmpty({ message: "The newPassword is required" })
  @IsStrongPassword()
  newPassword: string;

  @IsNotEmpty({ message: "The old password is required" })
  oldPassword: string;
}
