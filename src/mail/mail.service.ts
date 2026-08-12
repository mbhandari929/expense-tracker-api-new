import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const host = this.configService.get<string>('SMTP_HOST');

    const port = Number(this.configService.get<string>('SMTP_PORT'));

    const user = this.configService.get<string>('SMTP_USER');

    const password = this.configService.get<string>('SMTP_PASS');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!host || !port || !user || !password || !frontendUrl) {
      throw new ServiceUnavailableException(
        'Password reset email service is not configured.',
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass: password,
      },
    });

    const resetUrl = new URL('/reset-password', frontendUrl);

    resetUrl.searchParams.set('token', resetToken);

    await transporter.sendMail({
      from: `Expense Tracker <${user}>`,
      to: email,
      subject: 'Reset your Expense Tracker password',
      text: `
You requested a password reset.

Reset your password here:
${resetUrl.toString()}

This link expires in 15 minutes.

If you did not request this password reset, you can ignore this email.
      `.trim(),
    });
  }
}
