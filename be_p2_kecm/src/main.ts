import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('cliente');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Parcial2 - SIS257')
    .setDescription(
      'API Rest de la materia Desarrollo de Aplicación Int/Internet II',
    )
    .setVersion('1.0')
    .addTag('series')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('clientedoc', app, documentFactory);

  await app.listen(process.env.PORT ?? '');
  console.log(`App corriendo en ${await app.getUrl()}/clientedoc`);
}
bootstrap();
