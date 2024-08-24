// Empresa.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Empresa } from 'src/entity/Empresa.entity'
import { Ingresso } from 'src/entity/ingresso.entity';

@Injectable()
export class EmpresaService {


  constructor(
    @InjectRepository(Empresa)
    private readonly EmpresaRepository: Repository<Empresa>,
    private readonly connection: Connection,
  ) {}

  async incluirEmpresa(cnpj:string,nome:string, email:string,telefone:string,senha:string):Promise<void>{
    return await this.connection.query(
      `
        exec showme.incluirEmpresa '${cnpj}', '${nome}', '${email}','${telefone}', '${senha}'
      `
    )
  }

  async criarIngresso(email:String, idShow:Number):Promise<void> {
    return await this.connection.query(
      `
        exec showme.criarIngresso '${idShow}','${email}'
      `
    )
  }

  async excluirEmpresa(email: string, cnpj: string) {
    return await this.connection.query(
      `
        exec showme.excluirEmpresa '${cnpj}','${email}'
      `
    )
  }


  async alterarSenhaEmpresa(email:string, senha:string, cnpj:string)
  {
    console.log("metodo")
    return await this.connection.query(
      `
        exec showme.atualizarSenhaEmpresa '${senha}','${cnpj}', '${email}'
      `
    )
  }
}