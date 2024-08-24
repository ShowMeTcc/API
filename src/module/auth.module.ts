// src/module/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../service/auth.service';
import { ClienteService } from 'src/service/cliente.services';
import { JwtStrategy } from './estrategiaJWT';
import { Cliente } from 'src/entity/cliente.entity';
import { AuthController } from '../controller/auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'yourSecretKey', // Substitua 'yourSecretKey' pela sua chave secreta
      signOptions: { expiresIn: '60m' }, // Token válido por 60 minutos
    }),
    TypeOrmModule.forFeature([Cliente]),
  ],
  providers: [AuthService, ClienteService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
