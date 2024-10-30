import { Module } from '@nestjs/common';
import { AgendaController } from './agenda.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AgendaService } from './agenda.service';
import { InsertAgendaDto, UpdateAgendaDto } from './dto';

@Module({
  controllers: [AgendaController],
  providers: [AgendaService, PrismaService, InsertAgendaDto, UpdateAgendaDto],
})
export class AgendaModule {}
