import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/loginDto';
import { DbService } from 'src/db/db.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { users } from 'drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DbService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const validatedUserPayload = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );

    const accessToken = this.generateJwt(
      validatedUserPayload,
      'ACCESS_TOKEN_SECRET',
      '1d',
    );
    return { accessToken };
  }

  async validateUser(email: string, password: string) {
    const user = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user.length) {
      throw new UnauthorizedException('wrong email or password!');
    }

    const isPasswordMatches = await bcrypt.compare(password, user[0].password);

    if (!isPasswordMatches) {
      throw new UnauthorizedException('wrong email or password!');
    }

    const payload: JwtPayload = {
      userId: user[0].id,
      email: user[0].email,
    };

    return payload;
  }

  generateJwt(payload: JwtPayload, secretName: string, expiresInTime: string) {
    const secret = this.config.get<'string'>(secretName);
    const token = this.jwt.sign(payload, {
      secret,
      expiresIn: expiresInTime,
    });
    return token;
  }
}
