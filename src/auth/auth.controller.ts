import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin(@Request() req): any {
    return this.authService.login(req.user);
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Request() req, @Res() res) {
    const jwt = await this.authService.login(req.user);
    res.set('authorization', jwt.access_token);
    res.json(req.user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req): any {
    return this.authService.login(req.user);
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getHello(@Request() req): string {
    return req.user;
  }
}
