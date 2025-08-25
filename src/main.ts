import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                 // Strip unknown fields
      forbidNonWhitelisted: false,     // Set to true if you want to error on unknown fields
      transform: true,                 // Enable class-transformer
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
