import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAgendaDto } from './dto/update.agenda.dto';
import { InsertAgendaDto } from './dto/insert.agenda.dto';

@Injectable()
export class AgendaService {
  constructor(private prisma: PrismaService) {}

  async getAllAgendas() {
    const fetchAgendas = await this.prisma.agenda_Has_Event.findMany({
      select: {
        agenda: true,
        event: true,
        quantity: true,
        eventId: true,
      },
    });
    return {
      totalResults: fetchAgendas.length,
      agendas: fetchAgendas,
    };
  }
  async getAllAgendaEvents(agendaId: string) {
    const fetchAgendaEvents = await this.prisma.agenda_Has_Event.findMany({
      where: { agendaId: agendaId },
      orderBy: {
        eventId: 'desc',
      },
      select: {
        eventId: true,
        event: true,
        quantity: true,
      },
    });

    return {
      totalResults: fetchAgendaEvents.length,
      agendaEvents: fetchAgendaEvents,
    };
  }

  async addAgendaEvent(dto: InsertAgendaDto, id: string) {
    const newAgendaEvent = await this.prisma.agenda_Has_Event.create({
      data: {
        agendaId: id,
        eventId: dto.eventId,
        quantity: dto.quantity,
      },
    });

    return {
      message: 'Event added to agenda !',
      newAgendaEvent: newAgendaEvent,
    };
  }

  async updateAgendaEvent(
    agendaId: string,
    eventId: string,
    dto: UpdateAgendaDto,
  ) {
    const existingAgenda = await this.prisma.agenda_Has_Event.findUnique({
      where: {
        agendaId_eventId: {
          agendaId: agendaId,
          eventId: eventId,
        },
      },
    });

    if (
      !existingAgenda ||
      !existingAgenda.agendaId ||
      !existingAgenda.eventId
    ) {
      throw new ForbiddenException('Unexisting agenda or event');
    }

    const updatedAgendaEvent = await this.prisma.agenda_Has_Event.update({
      where: {
        agendaId_eventId: {
          agendaId: agendaId,
          eventId: eventId,
        },
      },
      data: { quantity: dto.quantity },
    });
    return {
      message: 'Agenda event updated !',
      updatedAgendaEvent: updatedAgendaEvent,
    };
  }

  async deleteAgendaEvent(agendaId: string, eventId: string) {
    const existingAgenda = await this.prisma.agenda_Has_Event.findUnique({
      where: {
        agendaId_eventId: {
          agendaId: agendaId,
          eventId: eventId,
        },
      },
    });

    if (
      !existingAgenda ||
      !existingAgenda.agendaId ||
      !existingAgenda.eventId
    ) {
      throw new ForbiddenException('Unexisting agenda or event');
    }

    const deletedAgendaEvent = await this.prisma.agenda_Has_Event.delete({
      where: {
        agendaId_eventId: {
          agendaId: agendaId,
          eventId: eventId,
        },
      },
    });
    return {
      message: 'Agenda event deleted !',
      deletedAgendaEvent: deletedAgendaEvent,
    };
  }
}
