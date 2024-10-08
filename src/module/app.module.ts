import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/controller/app.controller';
import { ShowController } from 'src/controller/show.controller';
import { Cliente } from 'src/models/cliente.entity';
import { AppService } from 'src/service/app.service';
import { ClienteService } from 'src/service/cliente.services';
import { ShowService } from 'src/service/show.services';
import { Show } from 'src/models/show.entity';
import { JwtModule } from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import { Empresa } from 'src/models/empresa.entity';
import { EmpresaController } from 'src/controller/empresa.controller';
import { EmpresaService } from 'src/service/empresa.service';
import { ImageService } from 'src/service/img.service';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: 'regulus.cotuca.unicamp.br',
        port: 1433,
        username: 'BD23341',
        password: 'BD23341',
        database: 'BD23341',
        entities: [],
        synchronize: true,
        extra: {
          encrypt: true, // Habilitar criptografia
          trustServerCertificate: true, // Confiança no certificado do servidor
        },
      }),
    }),
    TypeOrmModule.forFeature([Cliente,Show,Empresa],),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '!D2p$U5b&Q9w#N8f@G4',
      signOptions: { expiresIn: 'id' },
    })],
  
  controllers: [AppController, ShowController,EmpresaController],
  providers: [ClienteService, AppService,ShowService,EmpresaService,ImageService],
})
export class AppModule {}
