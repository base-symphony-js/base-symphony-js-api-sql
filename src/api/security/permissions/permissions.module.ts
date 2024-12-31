import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

// Middlewares
import { AuthenticationMiddleware, AuthorizationMiddleware } from '@middlewares'

// Controllers
import { PermissionsController } from './permissions.controller'

// Services
import { PrismaModule } from '@services'
import { PermissionsService } from './permissions.service'

@Module({
  imports: [PrismaModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes('api/security/permissions')
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes('api/security/permissions')
  }
}
