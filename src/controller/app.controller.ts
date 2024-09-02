import { Controller, Post, Body, Delete, Put, Get, BadRequestException, NotFoundException, Query, HttpStatus, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Cliente } from 'src/entity/cliente.entity';
import { ClienteService } from 'src/service/cliente.services';
import { ImageService } from 'src/service/img.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('clientes')
export class AppController {
  constructor(private readonly clienteService: ClienteService,private readonly imageService: ImageService) {}

  @Get('oi')
  async oi(): Promise<string> {
    return "A API ESTÁ NO AR E FUNCIONANDO";
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


  @Post('validar')
  async verificarLogin(@Body('email') email: string, @Body('senha') senha: string): Promise<any> {
    try {
      return await this.clienteService.validarCliente(email, senha);
    } catch (error) {
      throw new BadRequestException('Erro ao validar cliente');
    }
  }

  @Get('shows')
  async buscarShowsDoCliente(@Query ('email') email:string) : Promise<any>
  {
    try {
      return await this.clienteService.buscarShowsDoCliente(email);
    } catch (error) {
      throw new BadRequestException('Erro ao encontrar shows cliente');
    }
  }

  @Get('buscar')
  async todosOsCliente() : Promise<any>
  {
    try {
      return await this.clienteService.visualizarTodos();
    } catch (error) {
      throw new BadRequestException('Erro ao encontrar shows cliente');
    }
  }


  @Get ('infoCliente')
  async informarcaoCLiente (@Query ('email') email:string) : Promise<any>
  {
    try {
      return await this.clienteService.informacaoCliente(email);
    } catch (error) {
      throw new BadRequestException('Erro ao encontrar shows cliente');
    }
  }
  @Post('converter')
  async convertBase64ToImage(@Body('base64') base64String: string, @Body('format') format: 'png' | 'jpeg', @Res() res: Response) {
    try {
      const imageBuffer = await this.imageService.base64ToImage(base64String, format);
      res.setHeader('Content-Type', `image/${format}`);
      res.send(imageBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error processing image' });
    }
  }



  @Post('toBase64')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {
      if (!file) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
      }

      const base64String = await this.imageService.imageBufferToBase64(file.buffer);
      res.json({ base64: base64String });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error processing image' });
    }
  }

}