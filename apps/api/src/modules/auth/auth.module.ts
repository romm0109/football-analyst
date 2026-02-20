import { AuthConfig } from "../../config/auth.config";
import { SessionsRepository } from "../sessions/sessions.repository";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { GoogleStrategy } from "./strategies/google.strategy";

export interface AuthModule {
  authService: AuthService;
  authController: AuthController;
  authenticatedGuard: AuthenticatedGuard;
  googleStrategy: GoogleStrategy;
}

export function createAuthModule(
  usersService: UsersService,
  sessionsRepository: SessionsRepository,
  authConfig: AuthConfig
): AuthModule {
  const authService = new AuthService(usersService, sessionsRepository, authConfig);
  const googleStrategy = new GoogleStrategy(authConfig);
  const authController = new AuthController(authService, googleStrategy, authConfig);
  const authenticatedGuard = new AuthenticatedGuard();

  return {
    authService,
    authController,
    authenticatedGuard,
    googleStrategy
  };
}
