import { Controller, Post, Put, Delete, Body, BadRequestException, Get, Query } from '@nestjs/common';
import { EmpresaService } from 'src/service/empresa.service';



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
    @Body('idShow') idShow: number,
    @Body ('qtdIngresso') qtd:number,
  ): Promise<any> {
    try {
      const ingresso = await this.empresaService.criarIngresso(email, idShow,qtd);
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

  @Get('buscarShows')
  async buscarShows(@Query('email') email: string): Promise<any> {
    try {
      return await this.empresaService.buscarShows(email);
    } catch (error) {
      console.error('Erro ao buscar shows:', error.message);
      throw new BadRequestException('Erro ao buscar shows');
    }
  }



  @Get('buscar')
  async buscarEmpresas(): Promise<any>
  {
    return await this.empresaService.todasAsEmpresas();
  }

  @Get('infoEmpresa')

  async informacaoEmpresa(@Query('email') email: string): Promise<any>
  {
    return await this.empresaService.informacaoEmpresa(email);
  }


    @Get('infoShow')
    async infoShow(@Query ('idShow') idShow:number): Promise<any>
    {
      return await this.empresaService.infoDosShows(idShow);
    }


}