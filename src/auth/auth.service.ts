import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SignupDto) {
    const exisingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (exisingUser) {
      throw new ForbiddenException('Email already taken');
    }

    const hash = await argon.hash(dto.password);
// TODO: Make role/activation token optional, jsais pas comment wesh
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: 'user',
        activation_token: dto.activation_token,
      },
    });
    return this.signToken(user.id);
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid crendentials');
    }

    const isValidPassword = await argon.verify(user.password, dto.password);
    if (!isValidPassword) {
      throw new ForbiddenException('Invalid crendentials');
    }
    return this.signToken(user.id);
  }

  async signToken(userId: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
