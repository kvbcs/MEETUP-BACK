import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(99)
  title: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  description: string;

  @IsOptional()
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(999999)
  maxParticipants: number;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}
