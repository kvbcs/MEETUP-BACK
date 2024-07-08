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

  async updateUser(id: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUser || !existingUser.id) {
      throw new ForbiddenException("User doesn't exist");
    }

    return this.prisma.user.update({
      where: { id: id },
      data: { ...dto },
      select: {
        name: true,
        email: true,
        id: true,
        updatedAt: true,
      },
    });
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

    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
