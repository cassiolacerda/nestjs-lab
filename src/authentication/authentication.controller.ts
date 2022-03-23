import {
  Body,
  Get,
  Req,
  Res,
  Controller,
  HttpCode,
  UseGuards,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './request-with-user.interface';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('log-out')
  async logOut(@Res() response: Response) {
    const cookie = this.authenticationService.getCookieForLogOut();
    response.setHeader('Set-Cookie', cookie);
    return response.sendStatus(200);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
