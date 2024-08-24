// show.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Empresa } from 'src/entity/empresa.entity';
import { EmpresaService } from 'src/service/empresa.service';

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
/*
  @Post ('ingresso')
  async criarIngresso (
    @Body ('cpfCliente')
  ): Promise<void>{
    return await this.empresaService.criarIngresso();
  }
*/
  
}