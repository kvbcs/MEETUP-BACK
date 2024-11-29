import { ForbiddenException, Injectable } from '@nestjs/common';
import { InsertCategoryDto, UpdateCategoryDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    const allCategories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      totalResults: allCategories.length,
      categories: allCategories,
    };
  }

  async addCategory(dto: InsertCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existingCategory) {
      throw new ForbiddenException('Category already exists');
    }
    await this.prisma.category.create({
      data: { ...dto },
    });
    return {
      message: 'Category created !',
    };
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: id },
    });

    if (!existingCategory || !existingCategory.id) {
      throw new ForbiddenException('Unexisting id');
    }

    await this.prisma.category.update({
      where: { id: id },
      data: { ...dto },
    });

    return {
      message: 'Category updated !',
    };
  }

  async deleteCategory(id: string) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: id },
    });

    if (!existingCategory || !existingCategory.id) {
      throw new ForbiddenException('Unexisting id');
    }

    await this.prisma.category.delete({
      where: { id: id },
      select: { id: true, name: true, image: true },
    });

    return {
      message: 'Category deleted !',
    };
  }
}
