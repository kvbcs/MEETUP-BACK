import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { InsertEventDto, UpdateEventDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService, InsertEventDto, UpdateEventDto],
})
export class EventServiceModule {}
