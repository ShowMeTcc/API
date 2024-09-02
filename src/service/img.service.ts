import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { Buffer } from 'buffer';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class ImageService {

  async base64ToImage(base64String: string, format: 'png' | 'jpeg' = 'png'): Promise<Buffer> {
    // Remove o prefixo data:image/png;base64, se estiver presente
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    // Decodifica a string Base64 para um Buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Usa sharp para converter o buffer em imagem e aplicar o formato
    const processedImage = await sharp(imageBuffer).toFormat(format).toBuffer();

    return processedImage;
  }



  async imageToBase64(imagePath: string): Promise<string> {
    // Resolve o caminho absoluto da imagem
    const absolutePath = resolve(imagePath);

    // Leia a imagem do arquivo
    const imageBuffer = await readFile(absolutePath);

    // Converta a imagem para Base64
    const base64Data = await sharp(imageBuffer).toBuffer();
    const base64String = `data:image/${this.getImageFormat(absolutePath)};base64,${base64Data.toString('base64')}`;

    return base64String;
  }

  private getImageFormat(path: string): string {
    const ext = path.split('.').pop();
    return ext === 'jpg' ? 'jpeg' : ext;
  }
}
