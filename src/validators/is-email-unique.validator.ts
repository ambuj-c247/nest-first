import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { Injectable, Get } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@ValidatorConstraint({ name: "isEmailUnique", async: true })
@Injectable()
export class IsEmailUniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async validate(email: string, args: ValidationArguments) {
    const user = this.authService.isUniqueEmail(email);
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return "Email must be unique.";
  }
}
