import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Request() req, @Res() res) {
    const jwt = await this.authService.login(req.user);
    res.redirect(`http://localhost:5173?token=${jwt.access_token}`);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<any> {
    const { access_token } = await this.authService.login(req.user);
    return { token: access_token, ...req.user };
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getHello(@Request() req): string {
    return req.user;
  }
}
