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
import { EventService } from './event.service';
import { InsertEventDto, UpdateEventDto } from './dto';
import { JwtGuard } from 'src/auth/guards';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/all')
  getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get('/all/:query')
  searchEvents(@Param('query') query: string) {
    return this.eventService.searchEvents(query);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('/add')
  addEvent(@Body() dto: InsertEventDto) {
    return this.eventService.addEvent(dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch('/update/:id')
  updateEvent(@Body() dto: UpdateEventDto, @Param('id') id: string) {
    return this.eventService.updateEvent(id, dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/delete/:id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
