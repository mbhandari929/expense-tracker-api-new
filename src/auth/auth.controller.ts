import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: AuthCredentialsDto) {
    return this.authService.register(body.email, body.password);
  }

  @Public()
  @Post('login')
  login(@Body() body: AuthCredentialsDto) {
    return this.authService.login(body.email, body.password);
  }
}
