import { ObservabilityService } from "./observability.service";

export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  metrics(): { statusCode: number; body: unknown } {
    return {
      statusCode: 200,
      body: this.observabilityService.summary()
    };
  }
}
