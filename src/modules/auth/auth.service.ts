import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ){}
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.userService.findByUsername(createAuthDto.username);
    const md5Password = md5(createAuthDto.password).toUpperCase();
    if(user.password !== md5Password){
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, userid: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
