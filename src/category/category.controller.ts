import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { InsertCategoryDto, UpdateCategoryDto } from './dto';
import { JwtGuard } from 'src/auth/guards';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('/add')
  addCategory(@Body() dto: InsertCategoryDto) {
    return this.categoryService.addCategory(dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch('/update/:id')
  updateCategory(@Body() dto: UpdateCategoryDto, @Param('id') id: string) {
    return this.categoryService.updateCategory(id, dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
