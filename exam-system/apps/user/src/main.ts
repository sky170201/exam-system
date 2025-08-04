import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.enableCors();
  // 会把参数转为 dto 的实例
  // 例如：LoginUserDto { username: 'candy', password: '123456' }
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.port ?? 3001);
}
bootstrap();
