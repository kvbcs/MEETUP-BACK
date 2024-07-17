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
import { ProductService } from './product.service';
import { InsertProductDto, UpdateProductDto } from './dto';
import { JwtGuard } from 'src/auth/guards';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @UseGuards(JwtGuard)
  @Post('/add')
  addProduct(@Body() dto: InsertProductDto) {
    return this.productService.addProduct(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('/update/:id')
  updateProduct(@Body() dto: UpdateProductDto, @Param('id') id: string) {
    return this.productService.updateProduct(id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
