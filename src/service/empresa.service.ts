import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Empresa } from 'src/entity/empresa.entity';
import { Ingresso } from 'src/entity/ingresso.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly connection: Connection,
  ) {}

  async incluirEmpresa(cnpj: string, nome: string, email: string, telefone: string, senha: string): Promise<void> {
    try {
      await this.connection.query(
        `
          EXEC showme.incluirEmpresa '${cnpj}', '${nome}', '${email}', '${telefone}', '${senha}'
        `,
        [cnpj, nome, email, telefone, senha]
      );
    } catch (error) {
      console.error('Erro ao incluir empresa:', error.message);
      throw new BadRequestException('Erro ao incluir a empresa');
    }
  }

  async criarIngresso(email: string, idShow: number): Promise<any> {
    try {
      const result = await this.connection.query(
        `
          EXEC showme.criarIngresso '${email}','${idShow}'
        `,
        [email, idShow]
      );
      return result;
    } catch (error) {
      console.error('Erro ao criar ingresso:', error.message);
      throw new BadRequestException('Erro ao criar o ingresso');
    }
  }

  async excluirEmpresa(email: string, cnpj: string): Promise<void> {
    try {
      await this.connection.query(
        `
          EXEC showme.excluirEmpresa '${cnpj}', '${email}'
        `,
        [cnpj, email]
      );
    } catch (error) {
      console.error('Erro ao excluir a empresa:', error.message);
      throw new BadRequestException('Erro ao excluir a empresa');
    }
  }

  async alterarSenhaEmpresa(email: string, senha: string): Promise<void> {
    try {
      const result = await this.connection.query(
        `
          EXEC showme.atualizarSenhaEmpresa '${senha}', '${email}'
        `,
        [senha, email]
      );

    } catch (error) {
      console.error('Erro ao alterar a senha:', error.message);
      throw new BadRequestException('Erro ao alterar a senha da empresa');
    }
  }


  async validarEmpresa (email:string, senha:string)
  {
    return await this.connection.query(
      `
        exec showme.validarEmpresa '${email}','${senha}'
      `
    )
  }

  async buscarShows(email: string) {
    try {
      const result = await this.connection.query(
        `
        EXEC showme.buscarShowsPorEmpresa '${email}'
      `,
        [email]
      );
      return result;
    } catch (error) {
      console.error('Erro ao buscar shows:', error.message);
      throw new BadRequestException('Erro ao buscar shows');
    }
  }

  async todasAsEmpresas() {
    return await this.connection.query(
      `
        select * from showme.Empresa
      `
    )
  }

}