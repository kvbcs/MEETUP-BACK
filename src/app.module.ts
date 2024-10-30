import { Module } from '@nestjs/common';
import { ProductModule } from './event/event.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CartModule } from './agenda/agenda.module';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
    PrismaModule,
    CategoryModule,
    AuthModule,
    UserModule,
    CartModule,
    EmailModule,
    DatabaseModule,
  ],
})
export class AppModule {}
