import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = app.get(ConfigService).get<string>('PORT') || 3001;

  app.setGlobalPrefix('/graphql');

  app.enableCors({
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(PORT, () => {
    console.log(`server running on port ${PORT} ...`);
  });
}

bootstrap();
