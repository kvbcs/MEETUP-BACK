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

  @UseGuards(JwtGuard)
  @Post('/add')
  addEvent(@Body() dto: InsertEventDto) {
    return this.eventService.addEvent(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('/update/:id')
  updateEvent(@Body() dto: UpdateEventDto, @Param('id') id: string) {
    return this.eventService.updateEvent(id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
