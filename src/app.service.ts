import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserStorage } from './bd/user-storage.interface';
import { PostgresService } from './bd/postgres.service';
import { LocalBdService } from './bd/localbd.service';


@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private storage: UserStorage;

  constructor(
    private readonly postgresService: PostgresService,
    private readonly localBdService: LocalBdService,
  ) {}

  async onModuleInit() {
    await this.postgresService.ready;

    if (this.postgresService.isAvailable()) {
      this.storage = this.postgresService;
      this.logger.log('Using PostgresService as storage backend.');
    } else {
      this.storage = this.localBdService;
      this.logger.warn('Postgres unavailable, using LocalBdService instead.');
    }
  }

  async saveUser(firstName: string, lastName: string): Promise<void> {
    await this.storage.saveUser(firstName, lastName);
  }

  async getGreeting(): Promise<string> {
    return this.storage.getGreeting();
  }
}
