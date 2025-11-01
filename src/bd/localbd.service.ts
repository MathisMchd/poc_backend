import { Injectable } from '@nestjs/common';
import { UserStorage } from './user-storage.interface';

@Injectable()
export class LocalBdService implements UserStorage {
  private store: Record<string, { firstName: string; lastName: string }> = {};

  async saveUser(firstName: string, lastName: string): Promise<void> {
    this.store['user'] = { firstName, lastName };
  }

  async getGreeting(): Promise<string> {
    const user = this.store['user'] ?? { firstName: 'John', lastName: 'Doe' };
    return `Hello ${user.firstName} ${user.lastName} !`;
  }
}
