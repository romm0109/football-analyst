import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";

export interface CatalogModule {
  catalogService: CatalogService;
  catalogController: CatalogController;
}

export function createCatalogModule(): CatalogModule {
  const catalogService = new CatalogService();
  const catalogController = new CatalogController(catalogService);
  return { catalogService, catalogController };
}
