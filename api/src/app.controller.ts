import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('__coverage__')
  async coverage() {
    const globalAny: any = global;
    return { coverage: globalAny.__coverage__ };
  }
}
