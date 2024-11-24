import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8081', // Permitir apenas este domínio
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeçalhos permitidos
    credentials: true, // Permitir credenciais (cookies, cabeçalhos de autenticação)
  });

  const config = new DocumentBuilder()
      .setTitle('ShowMe')
      .setDescription('ShowMe routes')
      .setVersion('1.0')
      .addTag('ShowMe')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

  await app.listen(8080);
}
bootstrap();
