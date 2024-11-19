import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Empresa } from 'src/models/empresa.entity';
import { Ingresso } from 'src/models/ingresso.entity';

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

  async criarIngresso(idShow: number, qtdIngresso:Number,valor:number,descricao:string,estilo:string): Promise<any> {
    try {
      const result = await this.connection.query(

        `
          EXEC showme.criarIngresso ${idShow}, ${qtdIngresso},${valor},'${descricao}', '${estilo}'
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
        exec showme.buscarShowsPorEmpresa '${email}'
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

  async criarShow(idArtista:number,nome:string,local:string,dataShow:string,foto:string,hora:string,emailEmpresa:string)
  {
    try {
      const result = await this.connection.query(
        `  
          exec showme.incluirShow ${idArtista}, '${nome}' , '${local}' , '${dataShow}','${foto}','${hora}','${emailEmpresa}'
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


  async cadastrarArtista(nome:string){
    const queryResult = await this.connection.query(
      `
      insert into showme.Artista values ('${nome}')
      `,
      
    );
    return queryResult
  }

async cadastrarTipoIngresso(estilo:string) {
  try {
    const result = await this.connection.query(
      `  
        exec showme.CriarTipoIngresso '${estilo}'
      `,
    );
    return result;
  } catch (error) {
    console.error('Erro ao buscar shows:', error.message);
    throw new BadRequestException('Erro ao buscar shows');
  }
}

async todosIngressos(){
  const queryResult = await this.connection.query(
    `
    select * from showme.Ingresso
    `,
    
  );
  return queryResult
}

async ingressosDoShow(idShow:number){
  const queryResult = await this.connection.query(
    `
    select * from showme.Ingresso where idShow = ${idShow}
    `,
    
  );
  return queryResult
}


}