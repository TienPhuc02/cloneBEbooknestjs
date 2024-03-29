import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const reflector = app.get(Reflector);
  //khai báo 1 reflector từ app
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // sử dụng bảo vệ route với jwt toàn cầu

  //sử dụng hàm customize response message
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  //config cors
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Allow credentials (cookies) to be sent with requests
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  //api version
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    // prefix: 'api/v',
    defaultVersion: ['1', '2'], //v1,v2
  });
  app.use(cookieParser());
  const port = configService.get<string>('PORT');
  await app.listen(port);
}
bootstrap();
