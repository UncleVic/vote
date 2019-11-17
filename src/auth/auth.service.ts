import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  async login(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
