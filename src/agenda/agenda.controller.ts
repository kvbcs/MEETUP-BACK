import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { AgendaService } from './agenda.service';
import { InsertAgendaDto, UpdateAgendaDto } from './dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@UseGuards(JwtGuard)
@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @UseGuards(AdminGuard)
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

  @Delete('/delete/:agendaId')
  @HttpCode(HttpStatus.OK)
  deleteAllAgendaEvents(@Param('agendaId') agendaId: string) {
    return this.agendaService.deleteAllAgendaEvents(agendaId);
  }
}
