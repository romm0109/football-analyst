import { buildAuthConfig } from "./config/auth.config";
import { createAuthModule } from "./modules/auth/auth.module";
import { createCatalogModule } from "./modules/catalog/catalog.module";
import { createContextModule } from "./modules/context/context.module";
import { createDashboardModule } from "./modules/dashboard/dashboard.module";
import { createExportModule } from "./modules/export/export.module";
import { createFeedbackModule } from "./modules/feedback/feedback.module";
import { createIngestionModule } from "./modules/ingestion/ingestion.module";
import { createObservabilityModule } from "./modules/observability/observability.module";
import { createQueryModule } from "./modules/query/query.module";
import { SessionsRepository } from "./modules/sessions/sessions.repository";
import { createUsersModule } from "./modules/users/users.module";

export interface ApiAppModule {
  auth: ReturnType<typeof createAuthModule>;
  catalog: ReturnType<typeof createCatalogModule>;
  context: ReturnType<typeof createContextModule>;
  query: ReturnType<typeof createQueryModule>;
  dashboard: ReturnType<typeof createDashboardModule>;
  export: ReturnType<typeof createExportModule>;
  feedback: ReturnType<typeof createFeedbackModule>;
  ingestion: ReturnType<typeof createIngestionModule>;
  observability: ReturnType<typeof createObservabilityModule>;
}

export function createApiAppModule(env: NodeJS.ProcessEnv): ApiAppModule {
  const usersModule = createUsersModule();
  const sessionsRepository = new SessionsRepository();
  const authConfig = buildAuthConfig(env);
  const auth = createAuthModule(usersModule.usersService, sessionsRepository, authConfig);

  const catalog = createCatalogModule();
  const context = createContextModule(catalog.catalogService);
  const dashboard = createDashboardModule();
  const observability = createObservabilityModule();
  const query = createQueryModule(
    context.contextService,
    dashboard.dashboardRepository,
    observability.observabilityService
  );
  const exportModule = createExportModule(dashboard.dashboardService, observability.observabilityService);
  const feedback = createFeedbackModule();
  const ingestion = createIngestionModule();

  return {
    auth,
    catalog,
    context,
    query,
    dashboard,
    export: exportModule,
    feedback,
    ingestion,
    observability
  };
}
