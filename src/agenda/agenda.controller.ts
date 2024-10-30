import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { AgendaService } from './agenda.service';
import { InsertAgendaDto, UpdateAgendaDto } from './dto';

@UseGuards(JwtGuard)
@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Get('/all')
  getAllAgendas() {
    return this.agendaService.getAllAgendas();
  }

  @Get('/all/:id')
  getAllAgendaEvents(@Param('id') id: string) {
    return this.agendaService.getAllAgendaEvents(id);
  }

  @Post('/add/:id')
  addAgendaEvent(@Body() dto: InsertAgendaDto, @Param('id') id: string) {
    return this.agendaService.addAgendaEvent(dto, id);
  }

  @Patch('/update/:agendaId/:eventId')
  updateAgendaEvent(
    @Body() dto: UpdateAgendaDto,
    @Param('agendaId') agendaId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.agendaService.updateAgendaEvent(agendaId, eventId, dto);
  }

  @Delete('/delete/:agendaId/:eventId')
  deleteAgendaEvent(
    @Param('agendaId') agendaId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.agendaService.deleteAgendaEvent(agendaId, eventId);
  }
}
