import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidateUserAccessModule } from './module/user/domain/user/services/validateUserAccess/validateUserAccess.module';
import { AuthModule } from './module/user/useCases/auth/auth.module';
import { UserModule } from './module/user/useCases/user/user.module';
import configuration from './shared/config/configuration';
import { DiscordModule } from './shared/core/infra/messageLogger/implementations/discord/discord.module';
import { MessageLoggerModule } from './shared/core/infra/messageLogger/messageLogger.module';
import { TransactionManagerModule } from './shared/core/infra/prisma/transactionManager/transactionManager.module';
import { HttpExceptionFilter } from './shared/exceptions/httpException.filter';
import { PrismaModule } from './shared/infra/database/prisma/prisma.module';
import { CompositeInterceptor } from './shared/interceptors/composite.interceptor';
import { LogRequestInterceptor } from './shared/interceptors/logRequest.interceptor';
import { TransformResponseInterceptor } from './shared/interceptors/transformResponse.interceptor';
import { AlsMiddleware } from './shared/services/als/als.middleware';
import { AlsModule } from './shared/services/als/als.module';
import { NestJwtModule } from './shared/services/jwt/implementations/nest-jwt/nestJwt.module';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './shared/strategies/jwtRefresh.strategy';

@Module({
  imports: [
    // setup
    /** @note use this module when u already have a sqs env keys */
    // SqsModule,
    PrismaModule,
    ValidateUserAccessModule,
    TransactionManagerModule,
    DiscordModule,
    MessageLoggerModule,
    AlsModule,
    JwtModule,
    NestJwtModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        customProps: () => ({
          context: 'HTTP',
        }),
        redact: {
          paths: ['req.headers', 'res.headers'],
          remove: true,
        },
        enabled: process.env.NODE_ENV !== 'test',
      },
    }),
    // modules
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    LogRequestInterceptor,
    TransformResponseInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: CompositeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    AppService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
