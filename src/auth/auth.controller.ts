import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request as ExpressReq, Response } from 'express';
import { CurrentUser } from 'src/users/current-user.decorator';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(req.user);
    res.redirect(`http://localhost:5173/home?token=${tokens.access_token}`);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const tokens = await this.authService.login(user);
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });
    return { token: tokens.access_token, ...user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response): Promise<any> {
    res.clearCookie('refreshToken');
    return { message: 'Logged out succesfully' };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Request() req: ExpressReq,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const oldRefreshToken = req.cookies['refreshToken'];
    if (!oldRefreshToken) {
      throw new Error('Refresh token not found');
    }
    try {
      this.authService.validateRefreshToken(oldRefreshToken);
    } catch (error) {
      Redirect('http://localhost:5173/login');
      throw new Error(error);
    }
    const access_token =
      await this.authService.refreshAccessToken(oldRefreshToken);
    return { accessToken: access_token };
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'User cannot register. Try again!' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getHello(@Request() req): string {
    return req.user;
  }
}
