import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClienteService } from './cliente.services'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private clienteService: ClienteService, // Serviço para gerenciar usuários
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const acessoUser = await this.clienteService.findOneByEmail(email);
    if (acessoUser && await bcrypt.compare(pass, acessoUser.senha)) {
      const { senha, ...resposta } = acessoUser;
      return resposta;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
