import { ForbiddenException, Injectable } from '@nestjs/common';
import { InsertProductDto, UpdateProductDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    return this.prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        name: true,
        image: true,
        stock: true,
        price: true,
        category: true,
      },
    });
  }

  async addProduct(dto: InsertProductDto) {
    const newProduct = await this.prisma.product.create({
      data: {
        ...dto,
      },
    });
    return {
      message: 'Product created !',
      newProduct: newProduct,
    };
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct || !existingProduct.id) {
      throw new ForbiddenException('Unexisting id');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: id },
      data: {
        ...dto,
      },
    });

    return {
      message: 'Product updated !',
      updatedProduct: updatedProduct,
    };
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

    return {
      message: 'Product deleted !',
      deletedProduct: deletedProduct,
    };
  }
}
