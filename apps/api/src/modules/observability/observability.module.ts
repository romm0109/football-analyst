import { ObservabilityController } from "./observability.controller";
import { ObservabilityService } from "./observability.service";

export interface ObservabilityModule {
  observabilityService: ObservabilityService;
  observabilityController: ObservabilityController;
}

export function createObservabilityModule(): ObservabilityModule {
  const observabilityService = new ObservabilityService();
  const observabilityController = new ObservabilityController(observabilityService);
  return { observabilityService, observabilityController };
}
