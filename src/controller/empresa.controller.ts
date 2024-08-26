import { Controller, Post, Put, Delete, Body, BadRequestException } from '@nestjs/common';
import { EmpresaService } from 'src/service/empresa.service';
import { QueryFailedError } from 'typeorm';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post('incluir')
  async incluirEmpresa(
    @Body('cnpj') cnpj: string,
    @Body('nome') nome: string,
    @Body('email') email: string,
    @Body('telefone') telefone: string,
    @Body('senha') senha: string
  ): Promise<any> {
    try {
      await this.empresaService.incluirEmpresa(cnpj, nome, email, telefone, senha);
      return { message: 'Empresa incluída com sucesso' };
    } catch (error) {
      console.error('Erro ao incluir empresa:', error.message);
      throw new BadRequestException('Erro ao incluir a empresa');
    }
  }

  @Post('ingresso')
  async criarIngresso(
    @Body('email') email: string,
    @Body('idShow') idShow: number
  ): Promise<any> {
    try {
      const ingresso = await this.empresaService.criarIngresso(email, idShow);
      return ingresso;
    } catch (error) {
      console.error('Erro ao criar ingresso:', error.message);
      throw new BadRequestException('Erro ao criar o ingresso');
    }
  }

  @Delete()
  async deletarEmpresa(
    @Body('email') email: string,
    @Body('cnpj') cnpj: string
  ): Promise<any> {
    try {
      await this.empresaService.excluirEmpresa(email, cnpj);
      return { message: 'Empresa excluída com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir a empresa:', error.message);
      throw new BadRequestException('Erro ao excluir a empresa');
    }
  }

  @Put('senha')
  async mudarSenha(
    @Body('senha') senha: string,
    @Body('email') email: string
  ): Promise<any> {
    try {
      await this.empresaService.alterarSenhaEmpresa(email, senha);
      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      console.error('Erro ao alterar a senha:', error.message);
      throw new BadRequestException('Erro ao alterar a senha da empresa');
    }
  }

  @Post('validar')
  async verificarLogin(@Body('email') email: string, @Body('senha') senha: string): Promise<any> {
    try {
      return await this.empresaService.validarEmpresa(email, senha);
    } catch (error) {
      throw new BadRequestException('Erro ao validar Empresa');
    }
  }



}