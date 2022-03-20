import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @Post('log-in')
  async login(@Body() loginData: LoginDto) {
    return this.authenticationService.getAuthenticatedUser(loginData);
  }
}
