import { Controller, Post, Put, Delete, Body, BadRequestException, Get, Query, HttpStatus, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmpresaService } from 'src/service/empresa.service';
import { ImageService } from 'src/service/img.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';




@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService, private readonly imageService: ImageService) {}

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

  @Post('show')
  async criarShow(
    @Body('idArtista') idArtista: number,
    @Body('nome') nome: string,
    @Body ('localCep') localCep:string,
    @Body ('dataShow') dataShow:string,
    @Body ('foto') foto:string,
    @Body ('hora') hora:string
  ): Promise<any> {
    try {
      const show = await this.empresaService.criarShow(idArtista,nome,localCep,dataShow,foto,hora);
      return show;
    } catch (error) {
      console.error('Erro ao criar show:', error.message);
      throw new BadRequestException('Erro ao criar show');
    }
  }


  @Post('ingresso')
  async criarIngresso(
    @Body('email') email: string,
    @Body('idShow') idShow: number,
    @Body ('qtdIngresso') qtdIngresso:number,
    @Body ('valor') valor:number,
    @Body ('descricao') descricao:string
  ): Promise<any> {
    try {
      const ingresso = await this.empresaService.criarIngresso(email, idShow,qtdIngresso,valor,descricao);
      return ingresso;
    } catch (error) {
      console.error('Erro ao criar ingresso:', error.message);
      throw new BadRequestException('Erro ao criar o ingresso');
    }
  }

  @Delete()
  async deletarEmpresa(
    @Body('email') email: string,
    @Body('senha') senha: string
  ): Promise<any> {
    try {
      await this.empresaService.excluirEmpresa(email, senha);
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
    
    @Post('converter')
    async convertBase64ToImage(
      @Body() body: { base64: string; format: 'png' | 'jpeg' },
      @Res() res: Response
    ) {
      try {
        const { base64, format } = body;
        if (!base64 || !format) {
          return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Base64 string and format are required' });
        }
  
        const imageBuffer = await this.imageService.base64ToImage(base64, format);
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




  @Get('artistas')
  async todosArtistas(res:Response)
  {
    try {
      return await this.empresaService.todosArtistas();
    } catch (error) {
      console.error('Erro ao buscar todos os artistas:', error.message);
      throw new BadRequestException('Erro ao buscar todos os artistas');
    }
  }
}