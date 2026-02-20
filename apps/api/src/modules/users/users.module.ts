import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

export interface UsersModule {
  usersRepository: UsersRepository;
  usersService: UsersService;
}

export function createUsersModule(): UsersModule {
  const usersRepository = new UsersRepository();
  const usersService = new UsersService(usersRepository);
  return { usersRepository, usersService };
}
