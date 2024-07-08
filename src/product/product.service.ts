import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InsertProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaClient) {}

  async getAllProducts() {
    return this.prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async addProduct(dto: InsertProductDto) {
    const newProduct = await this.prisma.product.create({
      data: {
        ...dto,
      },
    });
    return newProduct;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct || !existingProduct.id) {
      throw new ForbiddenException('Unexisting id');
    }

    const updatedShoe = await this.prisma.product.update({
      where: { id: id },
      data: {
        ...dto,
      },
    });

    return updatedShoe;
  }

  async deleteProduct(id: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct || !existingProduct.id) {
      throw new ForbiddenException('Unexisting id');
    }

    const deletedProduct = await this.prisma.product.delete({
      where: { id: id },
    });

    return deletedProduct;
  }
}
