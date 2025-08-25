import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('FuelAI Backend API')
    .setDescription('API documentation for FuelAI Backend with Scheduler, HelloBuddy, and MCP Server modules')
    .setVersion('1.0')
    .addTag('scheduler', 'Scheduler task management endpoints')
    .addTag('hellobuddy', 'HelloBuddy module endpoints')
    .addTag('mcpserver', 'MCP Server module endpoints')
    .addBearerAuth() // Add if you plan to use authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api`);
}
bootstrap();
