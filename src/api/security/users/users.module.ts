import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

// Middlewares
import { AuthenticationMiddleware, AuthorizationMiddleware } from '@middlewares'

// Controllers
import { UsersController } from './users.controller'

// Services
import { PrismaModule } from '@services'
import { UsersService } from './users.service'

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('api/security/users')
    consumer.apply(AuthorizationMiddleware).forRoutes('api/security/users')
  }
}
