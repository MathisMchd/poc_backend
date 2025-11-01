
export interface UserStorage {
  saveUser(firstName: string, lastName: string): Promise<void>;
  getGreeting(): Promise<string>;
}
