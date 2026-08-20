import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const host = this.configService.get<string>('SMTP_HOST');

    const port = Number(this.configService.get<string>('SMTP_PORT'));

    const user = this.configService.get<string>('SMTP_USER');

    const password = this.configService.get<string>('SMTP_PASS');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (
      !host ||
      !Number.isInteger(port) ||
      port <= 0 ||
      port > 65535 ||
      !user ||
      !password ||
      !frontendUrl
    ) {
      this.logger.error(
        'Password reset email service is not configured correctly.',
      );

      throw new Error('Password reset email service is unavailable.');
    }

    let resetUrl: URL;

    try {
      resetUrl = new URL('/', frontendUrl);
      resetUrl.hash = `/reset-password?token=${encodeURIComponent(resetToken)}`;
    } catch (error) {
      this.logger.error(
        'FRONTEND_URL is invalid.',
        error instanceof Error ? error.stack : String(error),
      );

      throw new Error('Password reset email service is unavailable.');
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

    try {
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
    } catch (error) {
      this.logger.error(
        'Password reset email delivery failed.',
        error instanceof Error ? error.stack : String(error),
      );

      throw new Error('Password reset email delivery failed.');
    }
  }
}
