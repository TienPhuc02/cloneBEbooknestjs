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
    const { _id, fullName, email, role, phone, permissions } = payload;
    //gan then permission vao req.user
    const userRole = role as unknown as { _id: string; name: string };
    const temp = await this.rolesService.findOne(userRole._id);
    return {
      user: {
        id: _id,
        email: email,
        fullName: fullName,
        role: role,
        phone:phone,
        permissions: temp?.permissions ?? [],
      },
    };
  }
}
