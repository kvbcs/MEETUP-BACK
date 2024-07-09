import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password: string;
}
