import { ForbiddenException, Injectable } from '@nestjs/common';
import { InsertEventDto, UpdateEventDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getAllEvents() {
    const allEvents = await this.prisma.event.findMany({
      orderBy: {
        title: 'asc',
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
      totalResults: allEvents.length,
      events: allEvents,
    };
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
      throw new ForbiddenException('Unexisting id !');
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
      throw new ForbiddenException('Unexisting id !');
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
