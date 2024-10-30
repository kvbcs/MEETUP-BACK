import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { AgendaModule } from './agenda/agenda.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventModule,
    PrismaModule,
    CategoryModule,
    AuthModule,
    UserModule,
    AgendaModule,
    EmailModule,
    DatabaseModule,
  ],
})
export class AppModule {}
