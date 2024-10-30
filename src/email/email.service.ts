import { ForbiddenException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: Number(this.config.get('SMTP_PORT')),
      secure: process.env.MAILER_SECURE === 'false',
      auth: {
        user: this.config.get('SMTP_EMAIL'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendUserConfirmation(user: User, token: string) {
    const url = `${this.config.get('SERVER_URL')}/activate?token=${token}`;
    const emailHtml = `<p>Hey ${user.firstName},</p>
        <p>Your requested an account creation on our Event website</p>
            <a href='${url}'>Click here to activate your account</a>
        <p>If you did not request this email you can safely ignore it.</p>`;

    await this.transporter.sendMail({
      from: this.config.get('SMTP_EMAIL'),
      to: user.email,
      subject: `Welcome user ! Confirm your Email`,
      html: emailHtml,
    });
  }

  async confirmEmail(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new ForbiddenException('Invalid id');
    }

    const activateUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        activationToken: null,
      },
    });
    return {
      message: 'User activated !',
      activateUser: activateUser,
    };
  }
}
