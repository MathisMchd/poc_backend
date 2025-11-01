import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PostgresService } from './bd/postgres.service';
import { LocalBdService } from './bd/localbd.service';

@Module({
  providers: [AppService, PostgresService, LocalBdService],
  exports: [AppService],
})
export class AppModule {}
