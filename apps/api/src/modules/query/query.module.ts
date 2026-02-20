import { ContextService } from "../context/context.service";
import { DashboardRepository } from "../dashboard/dashboard.repository";
import { ObservabilityService } from "../observability/observability.service";
import { InsightService } from "./insight.service";
import { ParseService } from "./parse.service";
import { QueryController } from "./query.controller";
import { QueryRepository } from "./query.repository";
import { QueryService } from "./query.service";

export interface QueryModule {
  queryRepository: QueryRepository;
  parseService: ParseService;
  insightService: InsightService;
  queryService: QueryService;
  queryController: QueryController;
}

export function createQueryModule(
  contextService: ContextService,
  dashboardRepository: DashboardRepository,
  observabilityService: ObservabilityService
): QueryModule {
  const queryRepository = new QueryRepository();
  const parseService = new ParseService();
  const insightService = new InsightService();
  const queryService = new QueryService(
    queryRepository,
    contextService,
    parseService,
    insightService,
    dashboardRepository,
    observabilityService
  );
  const queryController = new QueryController(queryService);
  return {
    queryRepository,
    parseService,
    insightService,
    queryService,
    queryController
  };
}
