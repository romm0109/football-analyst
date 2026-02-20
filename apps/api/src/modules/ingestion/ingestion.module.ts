import { IngestionController } from "./ingestion.controller";
import { IngestionService } from "./ingestion.service";

export interface IngestionModule {
  ingestionService: IngestionService;
  ingestionController: IngestionController;
}

export function createIngestionModule(): IngestionModule {
  const ingestionService = new IngestionService();
  const ingestionController = new IngestionController(ingestionService);
  return { ingestionService, ingestionController };
}
