import { Injectable } from '@nestjs/common'
import { SERVER_URL_NAME } from '@common'

@Injectable()
export class AppService {
  getHello(): string {
    const html = `
      <h1>Swagger api documentation</h1>
      <h2><a href="${SERVER_URL_NAME}/api-docs">API v1</a></h2>
    `
    return html
  }
}
