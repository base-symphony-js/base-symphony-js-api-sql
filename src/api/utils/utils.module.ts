import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

// Middlewares
import { AuthenticationMiddleware } from '@middlewares'

// Controllers
import { UtilsController } from './utils.controller'

// Services
import { PrismaModule } from '@services'

@Module({
  imports: [PrismaModule],
  controllers: [UtilsController],
})
export class UtilsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('api/utils')
  }
}
