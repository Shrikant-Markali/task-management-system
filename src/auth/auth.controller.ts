import { Body, Controller, Get, HttpCode, HttpStatus, NotImplementedException, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GuestLoginDto } from './dto/guest-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  @HttpCode(HttpStatus.OK)
  guestLogin(@Body() dto: GuestLoginDto) {
    return this.authService.guestLogin(dto);
  }

  // Stubbed intentionally: real Google OAuth is out of scope for this
  // assessment (documented in README).
  @Post('google')
  @HttpCode(HttpStatus.OK)
  googleLogin(): never {
    throw new NotImplementedException(
      'Google login is UI-only in this build — use "Continue as Guest".',
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}