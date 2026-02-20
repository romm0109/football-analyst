import { CatalogService } from "./catalog.service";

export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  teams(): { statusCode: number; body: { teams: { id: string; name: string }[] } } {
    return {
      statusCode: 200,
      body: {
        teams: this.catalogService.listTeams()
      }
    };
  }

  competitions(): { statusCode: number; body: { competitions: { id: string; name: string }[] } } {
    return {
      statusCode: 200,
      body: {
        competitions: this.catalogService.listCompetitions()
      }
    };
  }
}
