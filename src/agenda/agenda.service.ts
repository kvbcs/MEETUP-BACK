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
    const existingAgendaEvent = await this.prisma.agenda_Has_Event.findUnique({
      where: {
        agendaId_eventId: {
          agendaId: id,
          eventId: dto.eventId,
        },
      },
    });

    if (existingAgendaEvent) {
      await this.prisma.agenda_Has_Event.update({
        where: {
          agendaId_eventId: {
            agendaId: id,
            eventId: dto.eventId,
          },
        },
        data: {
          quantity: existingAgendaEvent.quantity + dto.quantity,
        },
      });

      return {
        message: 'Event quantity updated in agenda!',
      };
    }
    await this.prisma.agenda_Has_Event.create({
      data: {
        agendaId: id,
        eventId: dto.eventId,
        quantity: dto.quantity,
      },
    });

    return {
      message: 'Event added to agenda !',
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

    await this.prisma.agenda_Has_Event.update({
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

    await this.prisma.agenda_Has_Event.delete({
      where: {
        agendaId_eventId: {
          agendaId: agendaId,
          eventId: eventId,
        },
      },
    });
    return {
      message: 'Agenda event deleted !',
    };
  }

  async deleteAllAgendaEvents(agendaId: string) {
    const existingAgenda = await this.prisma.agenda_Has_Event.findMany({
      where: {
        agendaId: agendaId,
      },
    });

    if (!existingAgenda || existingAgenda.length === 0) {
      throw new ForbiddenException('Unexisting agenda');
    }

    await this.prisma.agenda_Has_Event.deleteMany({
      where: {
        agendaId: agendaId,
      },
    });

    for (const agendaEvent of existingAgenda) {
      await this.prisma.event.update({
        where: {
          id: agendaEvent.eventId,
        },
        data: {
          quantity: {
            increment: agendaEvent.quantity,
          },
        },
      });
    }

    return {
      message: 'All events from the agenda have been deleted!',
    };
  }
}
