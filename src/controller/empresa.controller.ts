// show.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { Empresa } from 'src/entity/empresa.entity';
import { EmpresaService } from 'src/service/empresa.service';
import { QueryFailedError } from 'typeorm';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}
  @Post('incluir')
  async incluirEmpresa(
    @Body('cnpj') cpnj: string,
    @Body('nome') nome: string,
    @Body('email') email: string,
    @Body('telefone') telefone: string,
    @Body('senha') senha: string,

    ): Promise<void> {
        return await this.empresaService.incluirEmpresa(cpnj,nome, email,telefone,senha,);
  }

  @Post ('ingresso')
  async criarIngresso (
    @Body ('email') email:string,
    @Body ('idShow') idShow:Number,
  ): Promise<any>{
    try {
      var ingresso =  await this.empresaService.criarIngresso(email,idShow)
      return ingresso;
  } catch (error) {
      if (error instanceof QueryFailedError) {
          console.error('Erro ao executar a consulta:', error.message);
          return BadRequestException;
      } else {
          console.error('Erro desconhecido:', error);
          return BadRequestException;
      }
      return BadRequestException;
  } 
  }

  
}