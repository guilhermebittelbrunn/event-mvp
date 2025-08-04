/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable-next-line @typescript-eslint/no-require-imports, import/order, @typescript-eslint/no-unused-vars */
import helmet from '@fastify/helmet';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { API_VERSION } from './shared/core/utils/consts';

require('newrelic');

async function bootstrap() {
  console.info('🚀 Starting NestJS application...');

  try {
    console.info('📦 Creating NestJS application...');
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
      cors: true,
      bufferLogs: true,
    });

    console.info('🛡️ Registering helmet...');
    app.register(helmet);

    console.info('🔢 Enabling versioning...');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: API_VERSION,
    });

    console.info('📝 Setting up logger...');
    app.useLogger(app.get(Logger));

    console.info('🔄 Setting up interceptors...');
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    console.info('📚 Building OpenAPI docs...');
    buildOpenApiDocs(app);

    const port = process.env.PORT || 3000;
    console.info(`🌐 Starting server on port ${port}...`);
    await app.listen(port, '0.0.0.0');
    console.info(`✅ Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Error starting application:', error);
    throw error;
  }
}

function buildOpenApiDocs(app: NestFastifyApplication) {
  const generalDocsConfig = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token without any prefix`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'authorization',
    )
    .build();

  const generalDocsDocument = SwaggerModule.createDocument(app, generalDocsConfig);

  // set jwt auth in all endpoints by default
  generalDocsDocument.paths = Object.keys(generalDocsDocument.paths).reduce((acc, path) => {
    acc[path] = Object.keys(generalDocsDocument.paths[path]).reduce((methods, method) => {
      methods[method] = {
        ...generalDocsDocument.paths[path][method],
        security: [{ authorization: [] }],
      };
      return methods;
    }, {});
    return acc;
  }, {});

  SwaggerModule.setup('docs', app, generalDocsDocument, {
    swaggerOptions: {
      persistAuthorization: true, // keeps the authentication after reloading the page
      displayRequestDuration: true,
      filter: true,
    },
    customSiteTitle: 'Api Docs',
    customCss: `
      .swagger-ui .info { margin-bottom: 20px; }
      .swagger-ui .opblock-summary-method { font-weight: bold; font-size: 14px; }
  `,
  });
}

bootstrap();
