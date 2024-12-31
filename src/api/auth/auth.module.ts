import { Module } from '@nestjs/common'

// Controllers
import { AuthController } from './auth.controller'

// Services
import { PrismaModule } from '@services'
import { AuthService } from './auth.service'

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
