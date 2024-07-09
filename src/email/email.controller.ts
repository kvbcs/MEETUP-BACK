import { Controller, Get, Query, Res } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

//   @Get('confirm-email')
//   async confirmEmail(@Query('token') token: string, @Res() res: Response) {
//     const result = await this.emailService.confirmEmail(token);
//   }
}
