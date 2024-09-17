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

  async criarIngresso(email: string, idShow: number, qtdIngresso:Number,valor:number,descricao:string): Promise<any> {
    try {
      console.log(email,idShow,qtdIngresso,valor,descricao)
      const result = await this.connection.query(

        `
          EXEC showme.criarIngresso ${idShow}, '${email}', ${qtdIngresso},${valor},'${descricao}'
        `
      );
      return result;
    } catch (error) {
      console.error('Erro ao criar ingresso:', error.message);
      throw new BadRequestException('Erro ao criar o ingresso');
    }
  }

  async excluirEmpresa(email: string, senha: string): Promise<void> {
    try {
      await this.connection.query(
        `
          EXEC showme.excluirEmpresa '${senha}', '${email}'
        `,
        [senha, email]
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

  async informacaoEmpresa(email:string)
  {
    try {
      const result = await this.connection.query(
        `
        OPEN SYMMETRIC KEY MinhaChave
        DECRYPTION BY CERTIFICATE certificadoDeCriptografia
        SELECT e.nome as 'nome', e.email as 'email', CONVERT(varchar, DECRYPTBYKEY(e.cnpj)) AS 'cnpj', e.telefone as 'telefone' FROM showme.Empresa as e 
        WHERE email = '${email}'
      `,
        [email]
      );
      return result;
    } catch (error) {
      console.error('Erro ao buscar shows:', error.message);
      throw new BadRequestException('Erro ao buscar shows');
    }
  }

  async criarShow(idArtista:number,nome:string,localCep:string,dataShow:string,foto:string,hora:string)
  {
    try {
      const result = await this.connection.query(
        `  
          exec showme.incluirShow ${idArtista}, '${nome}' , '${localCep}' , '${dataShow}','${foto}','${hora}'
        `,
      );
      return result;
    } catch (error) {
      console.error('Erro ao buscar shows:', error.message);
      throw new BadRequestException('Erro ao buscar shows');
    }
  } 


  async infoDosShows(idShow:number)
  {
    const queryResult = await this.connection.query(
      `
      EXEC showme.informacoesShow ${idShow}
      `,
      
    );
      // V E R I F I C A R   O   Q U E   E S S A   R O T A   D E V E R I A   F A Z E R
    if (queryResult && queryResult.rowsAffected && queryResult.rowsAffected[0] === 0) {
      throw new Error('Show inexistente ou inválido');
    }
    else
    return queryResult[0]
  }


  async todosArtistas()
  {
    const queryResult = await this.connection.query(
      `
      select * from showme.Artista
      `,
      
    );
    return queryResult
  }


}