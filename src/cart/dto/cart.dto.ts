import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CartDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
