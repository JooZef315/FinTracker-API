import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { users } from 'drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private dbService: DbService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<'string'>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId));

    if (!user.length) {
      throw new UnauthorizedException();
    }
    return { userId: payload.userId, email: payload.email };
  }
}
