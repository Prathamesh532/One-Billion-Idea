import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_EXPIRATION:', process.env.JWT_EXPIRATION);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:3005'],
    credentials: true,
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Customer Service running on port ${port}`);
}
bootstrap();
