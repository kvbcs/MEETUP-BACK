import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartDto } from './dto';
import { UpdateCartDto } from './dto/update.cart.dto';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, CartDto, UpdateCartDto],
})
export class CartModule {}
