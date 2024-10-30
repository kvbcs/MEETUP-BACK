import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class InsertAgendaDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}
