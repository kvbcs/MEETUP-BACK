import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

   async getOneUser(id:string) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUser || !existingUser.id) {
      throw new ForbiddenException("User doesn't exist");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: { ...dto },
    });
    return {
      message: 'User updated !',
      updatedUser: updatedUser,
    };
  }

  async deleteUser(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser || !existingUser.id) {
      throw new ForbiddenException("User doesn't exist");
    }
    const deletedCartProducts = await this.prisma.cart_Has_Product.deleteMany({
      where: {
        cart: {
          userId: id,
        },
      },
    });
    const deletedCart = await this.prisma.cart.deleteMany({
      where: {
        userId: id,
      },
    });
    const deletedUser = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return {
      message: 'User deleted !',
      deletedUser: deletedUser,
      deltedCartProducts: deletedCartProducts,
      deletedCart: deletedCart,
    };
  }
}
