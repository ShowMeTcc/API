import { Controller, Post, Body, Res, HttpStatus, Get, Query } from '@nestjs/common';
import { ImageService } from 'src/service/img.service';
import { Response } from 'express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

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



  @Get('toBase64')
  async getImageAsBase64(@Query('path') imagePath: string, @Res() res: Response) {
    try {
      const base64String = await this.imageService.imageToBase64(imagePath);
      res.json({ base64: base64String });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error processing image' });
    }
  }


  
}