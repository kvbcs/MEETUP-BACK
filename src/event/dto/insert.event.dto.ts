import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
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
  @Max(999999)
  price: number;
  maxParticipants: number;

  @IsNotEmpty()
  @IsDate()
  startDate: string;
  endDate: string;
}
