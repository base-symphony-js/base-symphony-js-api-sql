import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

// Middlewares
import { AuthenticationMiddleware } from '@middlewares'

// Controllers
import { ProfileController } from './profile.controller'

// Services
import { PrismaModule } from '@services'
import { ProfileService } from './profile.service'
import { AuthService } from '@api/auth/auth.service'

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService, AuthService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('api/profile')
  }
}
