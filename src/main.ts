import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8081', // Permitir apenas este domínio
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeçalhos permitidos
    credentials: true, // Permitir credenciais (cookies, cabeçalhos de autenticação)
  });
  await app.listen(8080);
}
bootstrap();
