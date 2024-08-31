import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import envVars from './common/env/env.vars';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(envVars.PORT || 3000);
}
bootstrap();
