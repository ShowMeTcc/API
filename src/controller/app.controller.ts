import { Controller, Post, Body, Delete, Put, Get, BadRequestException, NotFoundException } from '@nestjs/common';
import { Cliente } from 'src/entity/cliente.entity';
import { ClienteService } from 'src/service/cliente.services';

@Controller('clientes')
export class AppController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get('oi')
  async oi(): Promise<string> {
    return "A API ESTÁ NO AR E FUNCIONANDO";
  }

  @Put('show')
  async buscarShowPertoDeMim(@Body('cep') cep: string): Promise<void> {
    await this.clienteService.buscarShowPertoDeMim(cep);
  }

  @Post('incluir')
  async incluirCliente(
    @Body('nome') nome: string,
    @Body('sobrenome') sobrenome: string,
    @Body('email') email: string,
    @Body('telefone') telefone: string,
    @Body('senha') senha: string,
    @Body('cpf') cpf: string,
    @Body('cep') cep: string,
    @Body('dataNascimento') dataNascimento: string,
  ): Promise<void> {
    try {
      console.log(nome, sobrenome, email, telefone, senha, cpf, cep, dataNascimento)
      await this.clienteService.incluirCliente(
        nome, sobrenome, email, telefone, senha, cpf, cep, dataNascimento
      );
    } catch (error) {
      throw new BadRequestException('Erro ao incluir cliente');
    }
  }

  @Delete('deletar')
  async deletarCliente(@Body('cpf') cpf: string, @Body('email') email: string): Promise<void> {
    try {
      await this.clienteService.deletarCliente(cpf, email);
    } catch (error) {
      throw new BadRequestException('Erro ao deletar cliente');
    }
  }

  @Put('atualizarNome')
  async atualizarNomeCliente(@Body('cpf') cpf: string, @Body('email') email: string, @Body('nome') nome: string): Promise<void> {
    try {
      await this.clienteService.atualizarNomeCliente(nome, cpf, email);
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar nome do cliente');
    }
  }

  // Outros métodos seguem a mesma estrutura de correção

  @Post('validar')
  async verificarLogin(@Body('email') email: string, @Body('senha') senha: string): Promise<any> {
    try {
      return await this.clienteService.validarCliente(email, senha);
    } catch (error) {
      throw new BadRequestException('Erro ao validar cliente');
    }
  }
}