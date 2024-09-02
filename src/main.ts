import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import envVars from './common/env/env.vars';
import { SuccessRespInterceptor } from './common/interceptors/success.resp.interceptor';
import { ErrorRespInterceptor } from './common/interceptors/error.resp.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        [envVars.DOCS_USERNAME]: envVars.DOCS_PASS,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Shortlet Test')
    .setDescription('Shortlet Test API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.useGlobalInterceptors(new SuccessRespInterceptor());

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ErrorRespInterceptor(httpAdapter));

  await app.listen(envVars.PORT || 3000);
}
bootstrap();
