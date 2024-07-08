import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { InsertProductDto } from './dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  getAllProducts() {
    return this.productService.getAllProducts;
  }

  @Post('/add')
  addProduct(@Body() dto: InsertProductDto) {
    return this.productService.addProduct(dto);
  }
}
