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

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  getAllCatgeories() {
    return this.categoryService.getAllCategories();
  }

  @UseGuards(JwtGuard)
  @Post('/add')
  addCategory(@Body() dto: InsertCategoryDto) {
    return this.categoryService.addCategory(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('/update/:id')
  updateCategory(@Body() dto: UpdateCategoryDto, @Param('id') id: string) {
    return this.categoryService.updateCategory(id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
