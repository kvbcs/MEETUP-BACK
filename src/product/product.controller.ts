import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { InsertProductDto, UpdateProductDto } from './dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post('/add')
  addProduct(@Body() dto: InsertProductDto) {
    return this.productService.addProduct(dto);
  }

  @Patch('/update/:id')
  updateProduct(@Body() dto: UpdateProductDto, @Param('id') id: string) {
    return this.productService.updateProduct(id, dto);
  }

  @Delete('/deleted/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
