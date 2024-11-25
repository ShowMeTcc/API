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
    @Body ('endereco') local:string,
    @Body ('dataShow') dataShow:string,
    @Body ('foto') foto:string,
    @Body ('hora') hora:string,
    @Body ('email') emailEmpresa:string
  ): Promise<any> {
    try {
      const show = await this.empresaService.criarShow(idArtista,nome,local,dataShow,foto,hora,emailEmpresa);
      return {"show":show};
    } catch (error) {
      console.error('Erro ao criar show:', error.message);
      throw new BadRequestException('Erro ao criar show');
    }
  }


  @Post('ingresso')
  async criarIngresso(
    @Body('idShow') idShow: number,
    @Body ('qtdIngresso') qtdIngresso:number,
    @Body ('valor') valor:number,
    @Body ('descricao') descricao:string,
    @Body ('estilo') estilo:string
  ): Promise<any> {
    try {
      const ingresso = await this.empresaService.criarIngresso(idShow,qtdIngresso,valor,descricao,estilo);
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


  @Post('criarArtista')
  async criarArtista(@Body('nome')nome: string,res:Response)
  {
    if(nome == null) res.status(HttpStatus.BAD_REQUEST).json({ mensagem: 'Nome do artista não fornecido'});
    try{
      return await this.empresaService.cadastrarArtista(nome);
    } catch (error){
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error interno no processamento' });
    }
  }

  @Post('criarTipoIngresso')
  async criarTipoIngresso (@Body ('estilo') estilo:string, res:Response){
    if(estilo == null) res.status(HttpStatus.BAD_REQUEST).json({ mensagem: 'Estilo do ingresso não foi passado'});
    try{
      return await this.empresaService.cadastrarTipoIngresso(estilo);
    } catch (error){
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error interno no processamento' });
    }
  }



  @Get('todosIngressos')
  async todosOsingressos() {
    return await this.empresaService.todosIngressos();
  }

  @Get('ingressosById')
  async ingressosByid(@Query ('idShow')idShow:number, res:Response){
    if(idShow == null) res.status(HttpStatus.BAD_REQUEST).json({ mensagem: 'idShow não fornecido'});
    try{
      return await this.empresaService.ingressosDoShow(idShow);
    } catch (error){
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error interno no processamento:'+error.mensage });
    }
  }

  @Post('validacaoRostos')
  @UseInterceptors(FileInterceptor('foto')) // 'foto' é o nome do campo no formulário
  async validacaoDeRostos(
    @Res() res: Response,
    @Body('email') email: string,
    @Body('idShow') idShow:number,
    @UploadedFile() foto: Express.Multer.File // Foto será o arquivo enviado
  ) {
    try {
      // Aqui você pode acessar o arquivo da foto, por exemplo:
      const desconhecido = await this.imageService.imageBufferToBase64(foto.buffer)
      
      const conhecido = await this.empresaService.getImgFromBd(email,idShow)
      console.log("conhecido:  "+conhecido)
      console.log("desconhecido:  "+desconhecido)
      
      const result = await this.empresaService.getDataFromPythonApi(conhecido,desconhecido);
      if (result.iguais == true){
        console.log("É IGUAL")
        return res.status(HttpStatus.OK).json({ result });
      }
      if(result.iguais == false){
        return res.status(HttpStatus.OK).json({ result });
      }
      return res.status(HttpStatus.OK).json({ message: 'Foto recebida com sucesso' });
    } catch (error) {
      console.error('Erro:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }


  @Post('reconhecimento')
  async apiPorApi(
    @Res() res: Response,
    @Body('conhecido')val1:string,
    @Body ('desconhecido') val2:string
    
    ) {
    try {
      const result = await this.empresaService.getDataFromPythonApi(val1,val2);
      if (result.iguais == true){
        console.log("É IGUAL")
        return res.status(HttpStatus.OK).json({ result });
      }
      if(result.iguais == false){
        return res.status(HttpStatus.OK).json({ result });
      }
    } catch (error) {
      console.error('Erro:', error); // Log para ajudar na depuração
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ''+error.message });
    }
  }

}