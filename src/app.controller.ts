import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return { 
      status: 'ok', 
      message: 'Sistema de facturación funcionando correctamente',
      timestamp: new Date().toISOString()
    };
  }
}
