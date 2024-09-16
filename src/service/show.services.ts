// show.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Show } from 'src/entity/show.entity'

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    private readonly connection: Connection,
  ) {}

  async incluirShowComData(nome: string, localCep: string, dataShow: Date, idArtista: Number): Promise<void> {
    await this.connection.query(
      `
      EXEC showme.incluirShowComData 
      ${idArtista},'${nome}', '${localCep}', '${dataShow}'
      `,
      [nome, localCep, dataShow, idArtista],
    );
  }

  async deletarShow(id: number): Promise<void> {
    const queryResult = await this.connection.query(
      `
      EXEC showme.cancelarShow '${id}'
      `,
      [id],
    );

    if (queryResult && queryResult.rowsAffected && queryResult.rowsAffected[0] === 0) {
      throw new Error('Show inexistente ou inválido');
    }
  }

  async atualizarShow(id: number, nome: string, localCep: string, dataShow: Date, idArtista: number): Promise<void> {
    const queryResult = await this.connection.query(
      `
      EXEC showme.atualizarShow '${id}','${nome}','${localCep}','${dataShow}','${idArtista}'
      `,
      [id, nome, localCep, dataShow, idArtista],
    );
      // V E R I F I C A R   O   Q U E   E S S A   R O T A   D E V E R I A   F A Z E R
    if (queryResult && queryResult.rowsAffected && queryResult.rowsAffected[0] === 0) {
      throw new Error('Show inexistente ou inválido');
    }
  }

  async listarShows(): Promise<Show[]> {
    return await this.connection.query(
      `
      exec showme.pegarTodosOsShows
      `,
    );
  }

  async buscarShowPorId(id: number): Promise<Show> {
    const shows = await this.connection.query(
      `
      select * from showme.Show where id = '${id}'
      `,
      [id],
    );

    if (shows.length === 0) {
      throw new Error('Show não encontrado');
    }

    return shows[0];
  }
}