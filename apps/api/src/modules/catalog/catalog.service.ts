export interface CatalogTeam {
  id: string;
  name: string;
}

export interface CatalogCompetition {
  id: string;
  name: string;
}

const TEAMS: CatalogTeam[] = [
  { id: "arsenal", name: "Arsenal" },
  { id: "liverpool", name: "Liverpool" },
  { id: "manchester-city", name: "Manchester City" },
  { id: "real-madrid", name: "Real Madrid" }
];

const COMPETITIONS: CatalogCompetition[] = [
  { id: "premier-league", name: "Premier League" },
  { id: "champions-league", name: "Champions League" }
];

export class CatalogService {
  listTeams(): CatalogTeam[] {
    return TEAMS;
  }

  listCompetitions(): CatalogCompetition[] {
    return COMPETITIONS;
  }

  isValidTeam(teamId: string): boolean {
    return TEAMS.some((team) => team.id === teamId);
  }
}
