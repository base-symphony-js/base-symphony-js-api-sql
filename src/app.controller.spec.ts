import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SERVER_URL_NAME } from '@common'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe(`
      <h1>Swagger api documentation</h1>
      <h2><a href="${SERVER_URL_NAME}/api-docs">API v1</a></h2>
    `)
    })
  })
})
