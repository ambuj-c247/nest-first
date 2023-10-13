import { IsOptional, IsString } from "class-validator";

export class FilterDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  filterRole: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  order: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}
