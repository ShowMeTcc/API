import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Cliente } from '../models/cliente.entity';
import axios from 'axios';

@Injectable()
export class ClienteService {
  httpService: any;
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly connection: Connection,
  ) {}

  async pesquisarPorEmail(email: string): Promise<any> {
    const result = await this.connection.query(
      `SELECT * FROM showme.Cliente WHERE email = $1`, [email]
    );
    if (result.length === 0) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return result;
  }

  async incluirCliente(
    nome: string,
    sobrenome: string,
    email: string,
    telefone: string,
    senha: string,
    cpf: string,
    cep: string,
    dataNascimento: string,
  ): Promise<void> {
    try {
      await this.connection.query(
        `EXEC showme.incluirCliente '${nome}', '${sobrenome}', '${email}','${telefone}', '${senha}', '${cpf}', '${cep}', '${dataNascimento}'`,
      );
    } catch (error) {
      throw new BadRequestException('Erro ao incluir cliente');
    }
  }

  async deletarCliente(senha: string, email: string): Promise<void> {

    return await this.connection.query(
      `EXEC showme.deletarCliente '${senha}', '${email}'`
    )
    
  }

  async atualizarNomeCliente(nome: string, cpf: string, email: string): Promise<void> {
    try {
      const queryResult = await this.connection.query(
        `EXEC showme.atualizarNomeCliente '${nome}', '${cpf}', '${email}'`,
        [nome, cpf, email]
      );
      if (queryResult.rowsAffected[0] === 0) {
        throw new NotFoundException('CPF inexistente e/ou inválido');
      }
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar nome do cliente');
    }
  }



  async atualizarSobrenomeCliente(sobrenome: string, cpf: string, email: string): Promise<void> {
    const queryResult = await this.connection.query(
      `
      EXEC showme.atualizarSobrenomeCliente '${sobrenome}','${cpf}','${email}'
      `,
      [sobrenome, cpf, email],
    );

    if (queryResult && queryResult.rowsAffected && queryResult.rowsAffected[0] === 0) {
      throw new Error('CPF inexistente e/ou inválido');
    }
  }

  async atualizarTelefoneCliente(telefone: string, cpf: string, email: string): Promise<void> {
    const queryResult = await this.connection.query(
      `
      EXEC showme.atualizarTelefoneCliente '${telefone}','${cpf}','${email}'
      `,
      [telefone, cpf, email],
    );

    if (queryResult && queryResult.rowsAffected && queryResult.rowsAffected[0] === 0) {
      throw new Error('Número de telefone atrelado ao CPF é inexistente e/ou inválido');
    }
  }

  async atualizarCepCliente(cep: string, cpf: string, email: string): Promise<void> {
    const queryResult = await this.connection.query(
      `
      EXEC showme.atualizarCepCliente '${cep}','${cpf}','${email}'
      `,
      [cep, cpf, email],
    );

    if (queryResult && queryResult.rowsAffected && queryResult.rowsAffected[0] === 0) {
      throw new Error('CEP atrelado ao CPF é inexistente e/ou inválido');
    }
  }

  async atualizarSenhaCliente(senha: string, cpf: string, email: string): Promise<void> {
    const queryResult = await this.connection.query(
      `
      EXEC showme.atualizarSenhaCliente '${senha}','${cpf}','${email}'
      `,
      [senha, cpf, email],
    );

    if (queryResult && queryResult.rowsAffected && queryResult.rowsAffected[0] === 0) {
      throw new Error('CPF inexistente e/ou inválido');
    }
  }

  async visualizarTodos(): Promise<Cliente[]> { 
    return await this.connection.query(
      `
      select * from showme.Cliente
      `,
      
    ); 
  }
  async validarCliente (email:string, senha:string)
  {
    return await this.connection.query(
      `
        exec showme.validarCliente '${email}','${senha}'
      `
    )
  }

  async findOneByEmail(email: string): Promise<Cliente | undefined> {
    return this.clienteRepository.findOne({ where: { email } });
  }

  async buscarShowPertoDeMim(cep): Promise<void>{
    return await this.connection.query(
      `
        exec showme.buscarShowsPertoDeMim '${cep}'
      `,
    )
    
  }


  async informacaoCliente (email:string): Promise<any>
  {
    return await this.connection.query(
      `
      OPEN SYMMETRIC KEY MinhaChave
      DECRYPTION BY CERTIFICATE certificadoDeCriptografia
      SELECT c.nome + ' ' + c.sobrenome AS 'nome', CONVERT(varchar, DECRYPTBYKEY(c.cpf)) AS 'cpf', c.email AS 'email',
      c.dataNascimento AS 'dataNascimento' FROM showme.Cliente AS c WHERE c.email = '${email}'
      `,
    )
  }

  async buscarShowsDoCliente (email:string): Promise<any>
  {
    return await this.connection.query(
      `
        exec showme.buscarShowsPorCliente '${email}'
      `
    )
  }


  async cadastrarCompra(foto,email,cpf,idShow,idIngresso,qtdComprada){
    return await this.connection.query(
      `
        exec showme.efetuarCompra '${foto}','${email}','${cpf}', ${idShow}, ${idIngresso},${qtdComprada}
      `,
    )
  }

  async getDataFromPythonApi() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/hello');
      return response.data;
    } catch (error) {
      console.error('Erro ao chamar a API Python:', error);
      throw new Error('Erro ao chamar a API Python');
    }
  }
}