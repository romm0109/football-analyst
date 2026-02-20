export interface AuthenticatedRequest {
  sessionId?: string;
  user?: { id: string; email: string; name: string };
}

export class AuthenticatedGuard {
  canActivate(request: AuthenticatedRequest): boolean {
    return Boolean(request.sessionId && request.user?.id);
  }
}
