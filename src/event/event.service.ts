import {
  BadRequestException,
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
        category: {
          select: {
            name: true,
          },
        },
        image: true,
        description: true,
        quantity: true,
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
    const fetchEvent = await this.prisma.event.findUnique({
      where: { id: id },
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
        quantity: true,
        maxParticipants: true,
        price: true,
        startDate: true,
        endDate: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!fetchEvent) {
      throw new NotFoundException('Event not found!');
    }

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

    if (newEvent.startDate.getTime() > newEvent.endDate.getTime()) {
      throw new BadRequestException('Start date cannot be after End date !');
    }

    if (newEvent.startDate.getTime() == newEvent.endDate.getTime()) {
      throw new BadRequestException(
        'Start date and End date cannot be the same !',
      );
    }
    return {
      message: 'Event created !',
    };
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: id },
    });

    if (!existingEvent || !existingEvent.id) {
      throw new NotFoundException('Unexisting id !');
    }

    await this.prisma.event.update({
      where: { id: id },
      data: {
        ...dto,
      },
    });

    return {
      message: 'Event updated !',
    };
  }

  async deleteEvent(id: string) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: id },
    });

    if (!existingEvent || !existingEvent.id) {
      throw new NotFoundException('Unexisting id !');
    }

   await this.prisma.event.delete({
      where: { id: id },
    });

    return {
      message: 'Event deleted !',
    };
  }
}
