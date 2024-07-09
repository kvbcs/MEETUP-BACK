import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaClient } from '@prisma/client';
import { InsertProductDto, UpdateProductDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    InsertProductDto,
    UpdateProductDto,
  ],
})
export class ProductModule {}
