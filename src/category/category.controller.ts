import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  getAllCatgeories() {
    return this.categoryService.getAllCategories();
  }

  @Post('/add')
  addCategory(@Body() dto: CategoryDto) {
    return this.categoryService.addCategory(dto);
  }

  @Patch('/update/:id')
  updateCategory(@Body() dto: CategoryDto, @Param('id') id: string) {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete('/delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
