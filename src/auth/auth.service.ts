import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from '../users/entities/user.entity';
import { GuestLoginDto } from './dto/guest-login.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  // "Continue as Guest": creates a fresh guest account (no password /
  // email required) and immediately signs a JWT.
  async guestLogin(dto: GuestLoginDto): Promise<{ token: string; user: User }> {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const user = this.users.create({
      fullName: dto.fullName?.trim() || `Guest ${suffix}`,
      isGuest: true,
      avatarSeed: randomUUID(),
    });
    const saved = await this.users.save(user);
    return { token: this.signToken(saved), user: saved };
  }

  private signToken(user: User): string {
    const payload: JwtPayload = { sub: user.id, isGuest: user.isGuest };
    return this.jwt.sign(payload);
  }
}