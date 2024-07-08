import {
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

export class InsertProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(99)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsUUID()
    categoryId: string;
    
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(999999)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(999)
  stock: number;
}
