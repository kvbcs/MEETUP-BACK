import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword()
  password: string;
}
