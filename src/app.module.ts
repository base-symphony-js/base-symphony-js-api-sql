import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

// Middlewares
import { LanguageMiddleware } from '@middlewares'

// App
import { AppController } from './app.controller'
import { AppService } from './app.service'

// Modules
import { AuthModule } from '@api/auth/auth.module'
import { ProfileModule } from '@api/profile/profile.module'
import { UsersModule } from '@api/security/users/users.module'
import { RolesModule } from '@api/security/roles/roles.module'
import { PermissionsModule } from '@api/security/permissions/permissions.module'
import { UtilsModule } from '@api/utils/utils.module'

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('api')
  }
}
