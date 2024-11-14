import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InsertEventDto, UpdateEventDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getAllEvents() {
    const allEvents = await this.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        categoryId: true,
        category: true,
        image: true,
        description: true,
        maxParticipants: true,
        price: true,
        startDate: true,
        endDate: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      totalResults: allEvents.length,
      events: allEvents,
    };
  }

  async getOneEvent(id: string) {
    // Recherche de l'événement et sélection des champs spécifiques en une seule requête
    const fetchEvent = await this.prisma.event.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        categoryId: true,
        category: true,
        image: true,
        description: true,
        maxParticipants: true,
        price: true,
        startDate: true,
        endDate: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Si l'événement n'existe pas, lève une exception
    if (!fetchEvent || !fetchEvent.id) {
      throw new NotFoundException('Event not found!');
    }

    // Retourne l'événement trouvé
    return fetchEvent;
  }

  async searchEvents(query: string) {
    const results = await this.prisma.event.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      select: {
        id: true,
        title: true,
        categoryId: true,
        category: true,
        image: true,
        description: true,
        maxParticipants: true,
        price: true,
        startDate: true,
        endDate: true,
        isAvailable: true,
      },
    });
    return {
      totalResults: results.length,
      results: results,
    };
  }

  async searchEventsByCategory(query: string) {
    const results = await this.prisma.event.findMany({
      where: {
        category: {
          name: {
            contains: query,
          },
        },
      },
      select: {
        id: true,
        title: true,
        categoryId: true,
        category: {
          select: {
            name: true,
          },
        },
        image: true,
        description: true,
        maxParticipants: true,
        price: true,
        startDate: true,
        endDate: true,
        isAvailable: true,
      },
    });
    return {
      totalResults: results.length,
      results: results,
    };
  }

  async addEvent(dto: InsertEventDto) {
    const newEvent = await this.prisma.event.create({
      data: {
        ...dto,
      },
    });
    return {
      message: 'Event created !',
      newEvent: newEvent,
    };
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: id },
    });

    if (!existingEvent || !existingEvent.id) {
      throw new NotFoundException('Unexisting id !');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id: id },
      data: {
        ...dto,
      },
    });

    return {
      message: 'Event updated !',
      updatedEvent: updatedEvent,
    };
  }

  async deleteEvent(id: string) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: id },
    });

    if (!existingEvent || !existingEvent.id) {
      throw new NotFoundException('Unexisting id !');
    }

    const deletedEvent = await this.prisma.event.delete({
      where: { id: id },
    });

    return {
      message: 'Event deleted !',
      deletedEvent: deletedEvent,
    };
  }
}
