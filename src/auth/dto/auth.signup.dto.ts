import {
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
  MaxLength,
  IsString,
  MinLength,
  IsEmpty,
} from 'class-validator';
export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MaxLength(255)
  password: string;

  @IsEmpty()
  roleId: string;

  @IsEmpty()
  agendaId: string;

  @IsEmpty()
  activationToken: string;
}
