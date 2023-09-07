import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { ConfigService } from '@nestjs/config';

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
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const port = configService.get<string>('PORT');
  await app.listen(port);
}
bootstrap();
