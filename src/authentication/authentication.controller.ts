import {
  Body,
  Req,
  Res,
  Controller,
  HttpCode,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './request-with-user.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const user = request.user;
    user.password = undefined;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return response.send(user);
  }
}
