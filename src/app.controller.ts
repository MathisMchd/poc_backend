import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('user')
  async saveUser(@Body('firstName') firstName: string, @Body('lastName') lastName: string) {
    if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
      throw new BadRequestException('Le champ "firstName" est requis et doit être une chaîne non vide.');
    }
    if (!lastName || typeof lastName !== 'string' || !lastName.trim()) {
      throw new BadRequestException('Le champ "lastName" est requis et doit être une chaîne non vide.');
    }

    await this.appService.saveUser(firstName.trim(), lastName.trim());
    return { ok: true, firstName: firstName.trim(), lastName: lastName.trim() };
  }

  @Get('hello')
  async getHello() {
    return { message: await this.appService.getGreeting() };
  }
}
