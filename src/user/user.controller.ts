import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { JwtGuard } from 'src/auth/guards';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@UseGuards(JwtGuard, AdminGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/profile/:id')
  getOneUser(@Param('id') id: string) {
    return this.userService.getOneUser(id);
  }

  @Patch('/update/:id')
  editUser(@Body() dto: UpdateUserDto, @Param('id') id: string) {
    return this.userService.updateUser(id, dto);
  }

  @Delete('/delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
