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
    // Vérifier s'il existe déjà une entrée avec la même combinaison de agendaId et eventId
    const existingAgendaEvent = await this.prisma.agenda_Has_Event.findUnique({
      where: {
        agendaId_eventId: {
          agendaId: id,
          eventId: dto.eventId,
        },
      },
    });

    // Si l'entrée existe déjà, mettre à jour la quantité
    if (existingAgendaEvent) {
      const updatedAgendaEvent = await this.prisma.agenda_Has_Event.update({
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
        agendaEvent: updatedAgendaEvent,
      };
    }
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

  async deleteAllAgendaEvents(agendaId: string) {
    // Vérifier si l'agenda existe
    const existingAgenda = await this.prisma.agenda_Has_Event.findFirst({
      where: {
        agendaId: agendaId,
      },
    });

    if (!existingAgenda || !existingAgenda.agendaId) {
      throw new ForbiddenException('Unexisting agenda');
    }

    // Supprimer tous les événements associés à cet agenda
    const deletedAgendaEvents = await this.prisma.agenda_Has_Event.deleteMany({
      where: {
        agendaId: agendaId,
      },
    });

    return {
      message: 'All events from the agenda have been deleted!',
      results: deletedAgendaEvents,
    };
  }
}
