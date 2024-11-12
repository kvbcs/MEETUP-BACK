import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class InsertEventDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(99)
  title: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(9999)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(999999)
  maxParticipants: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'Start Date must in a valid format DD/MM/YYYY',
  })
  startDate: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'End Date must in a valid format DD/MM/YYYY',
  })
  endDate: string;
}
