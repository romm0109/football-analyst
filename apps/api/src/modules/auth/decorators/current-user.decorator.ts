import { AuthenticatedRequest } from "../guards/authenticated.guard";

export function currentUser(request: AuthenticatedRequest): AuthenticatedRequest["user"] {
  return request.user;
}
