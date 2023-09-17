import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    const { role } = payload;
    const userRole = role as unknown as { _id: string; name: string };
    console.log(
      '🚀 ~ file: auth.service.ts:25 ~ AuthService ~ validateUser ~ userRole:',
      userRole,
    );
    const temp = (await this.rolesService.findOne(userRole._id)).toObject();
    return {
      user: {
        id: payload._id,
        email: payload.email,
        fullName: payload.fullName,
        role: payload?.role,
        phone: payload.phone,
        permissions: temp?.permissions ?? [],
      },
    };
  }
}
