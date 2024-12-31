import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

// Middlewares
import { AuthenticationMiddleware, AuthorizationMiddleware } from '@middlewares'

// Controllers
import { RolesController } from './roles.controller'

// Services
import { PrismaModule } from '@services'
import { RolesService } from './roles.service'

@Module({
  imports: [PrismaModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('api/security/roles')
    consumer.apply(AuthorizationMiddleware).forRoutes('api/security/roles')
  }
}
