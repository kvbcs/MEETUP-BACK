import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    const allCategories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: { name: true, id: true },
    });

    return allCategories;
  }

  async addCategory(dto: CategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existingCategory) {
      throw new ForbiddenException('Category already exists');
    }
    const newCategory = await this.prisma.category.create({
      data: { ...dto },
    });
    return {
      message: 'Category created !',
      newCategory: newCategory,
    };
  }

  async updateCategory(id: string, dto: CategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: id },
    });

    if (!existingCategory || !existingCategory.id) {
      throw new ForbiddenException('Unexisting id');
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id: id },
      data: { ...dto },
    });

    return {
      message: 'Category updated !',
      updatedCategory: updatedCategory,
    };
  }

  async deleteCategory(id: string) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: id },
    });

    if (!existingCategory || !existingCategory.id) {
      throw new ForbiddenException('Unexisting id');
    }

    const deletedCategory = await this.prisma.category.delete({
      where: { id: id },
      select: { name: true, id: true },
    });

    return {
      message: 'Category deleted !',
      deletedCategory: deletedCategory,
    };
  }
}
