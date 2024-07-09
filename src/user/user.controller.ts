import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  getAllUsers() {
    return this.userService.getAllUsers();
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
