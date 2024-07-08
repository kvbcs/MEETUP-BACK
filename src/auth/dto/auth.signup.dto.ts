import {
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
  MaxLength,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsOptional()
  role: string;

  @IsOptional()
  activation_token: string;
}
