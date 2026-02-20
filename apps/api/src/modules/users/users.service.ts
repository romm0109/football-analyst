import { UpsertUserInput, UserRecord, UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async upsertGoogleUser(input: UpsertUserInput): Promise<UserRecord> {
    return this.usersRepository.upsertByGoogleSub(input);
  }

  async findByGoogleSub(googleSub: string): Promise<UserRecord | null> {
    return this.usersRepository.findByGoogleSub(googleSub);
  }

  async findById(userId: string): Promise<UserRecord | null> {
    return this.usersRepository.findById(userId);
  }
}
