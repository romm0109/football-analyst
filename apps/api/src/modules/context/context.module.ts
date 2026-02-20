import { CatalogService } from "../catalog/catalog.service";
import { ContextController } from "./context.controller";
import { ContextRepository } from "./context.repository";
import { ContextService } from "./context.service";

export interface ContextModule {
  contextRepository: ContextRepository;
  contextService: ContextService;
  contextController: ContextController;
}

export function createContextModule(catalogService: CatalogService): ContextModule {
  const contextRepository = new ContextRepository();
  const contextService = new ContextService(contextRepository, catalogService);
  const contextController = new ContextController(contextService);
  return { contextRepository, contextService, contextController };
}
