// show.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ShowService } from 'src/service/show.services';
import { Show } from '../entity/show.entity';

@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Post()
  async criarShow(@Body() showData: Show): Promise<void> {
    const { nome, localCep, dataShow, idArtista } = showData;
    await this.showService.incluirShowComData(nome, localCep, dataShow, idArtista);
  }

  @Get()
  async listarShows(): Promise<Show[]> {
    return await this.showService.listarShows();
  }

  @Get(':id')
  async buscarShowPorId(@Param('id') id: string): Promise<Show> {
    return await this.showService.buscarShowPorId(Number(id));
  }

  @Put(':id')
  async atualizarShow(@Param('id') id: string, @Body() showData: Show): Promise<void> {
    const { nome, localCep, dataShow, idArtista } = showData;
    await this.showService.atualizarShow(Number(id), nome, localCep, dataShow, idArtista);
  }

  @Delete(':id')
  async deletarShow(@Param('id') id: string): Promise<void> {
    await this.showService.deletarShow(Number(id));
  }
}
