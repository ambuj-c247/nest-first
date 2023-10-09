import {
  IsEmail,
  IsOptional,
  IsString,
  //   IsNotEmpty,
  Length,
} from "class-validator";

export class EditUserDto {
  @IsOptional()
  @IsString()
  @Length(6, 20, {
    message:
      "The full name must be at least 6 but not longer than 20 characters",
  })
  fullName: string;
  @IsOptional()
  @IsEmail()
  email: string;
}
