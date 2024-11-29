import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
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
    const activationToken = await argon.hash(`${new Date()} + ${dto.email}`);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hash,
        roleId: `${process.env.USER_ROLE}`,
        isActive: false,
        activationToken: activationToken,
      },
    });
    const NewAgenda = await this.prisma.agenda.create({
      data: {
        userId: user.id,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { agendaId: NewAgenda.id }, 
    });

    await this.emailService.sendUserConfirmation(user, activationToken);

    return {
      message: 'Sign up successful!',
      user: { ...user, agendaId: NewAgenda.id }, 
      agenda: NewAgenda, 
    };
  }

  async signin(dto: SigninDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!existingUser || !existingUser.email) {
      throw new ForbiddenException('Invalid crendentials');
    }

    const isValidPassword = await argon.verify(
      existingUser.password,
      dto.password,
    );
    if (!isValidPassword) {
      throw new ForbiddenException('Invalid crendentials');
    }

    const existingAgenda = await this.prisma.agenda.findFirst({
      where: {
        userId: existingUser.id,
      },
    });
    const token = await this.signToken(existingUser.id);

    return {
      token,
      role: existingUser.roleId,
      agenda: existingAgenda.id,
    };
  }

  async signToken(userId: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
