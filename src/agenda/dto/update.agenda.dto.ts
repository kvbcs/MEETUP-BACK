import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAgendaDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
