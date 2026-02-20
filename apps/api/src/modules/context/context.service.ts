import { TeamContext } from "../../../../../libs/shared-types/src";
import { CatalogService } from "../catalog/catalog.service";
import { ContextRecord, ContextRepository, defaultAnalysisWindow } from "./context.repository";

export class ContextService {
  constructor(
    private readonly contextRepository: ContextRepository,
    private readonly catalogService: CatalogService
  ) {}

  async save(sessionId: string, context: Partial<TeamContext>): Promise<ContextRecord> {
    const teamId = context.teamId;
    const opponentId = context.opponentId;
    if (!teamId || !opponentId) {
      throw new Error("invalid_context");
    }
    if (!this.catalogService.isValidTeam(teamId) || !this.catalogService.isValidTeam(opponentId)) {
      throw new Error("unknown_team");
    }

    return this.contextRepository.upsert(sessionId, {
      teamId,
      opponentId,
      window: context.window ?? defaultAnalysisWindow()
    });
  }

  async get(sessionId: string): Promise<ContextRecord | null> {
    return this.contextRepository.findBySessionId(sessionId);
  }
}
