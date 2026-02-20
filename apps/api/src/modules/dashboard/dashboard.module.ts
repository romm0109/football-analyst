import { DashboardController } from "./dashboard.controller";
import { DashboardRepository } from "./dashboard.repository";
import { DashboardService } from "./dashboard.service";

export interface DashboardModule {
  dashboardRepository: DashboardRepository;
  dashboardService: DashboardService;
  dashboardController: DashboardController;
}

export function createDashboardModule(): DashboardModule {
  const dashboardRepository = new DashboardRepository();
  const dashboardService = new DashboardService(dashboardRepository);
  const dashboardController = new DashboardController(dashboardService);

  return {
    dashboardRepository,
    dashboardService,
    dashboardController
  };
}
