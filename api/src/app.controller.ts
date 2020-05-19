import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('__coverage__')
  @ApiExcludeEndpoint()
  async coverage() {
    const globalAny: any = global;
    return { coverage: globalAny.__coverage__ };
  }
}
