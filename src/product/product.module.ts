import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaClient } from '@prisma/client';
import { InsertProductDto, UpdateProductDto } from './dto';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaClient, InsertProductDto, UpdateProductDto],
})
export class ProductModule {}
