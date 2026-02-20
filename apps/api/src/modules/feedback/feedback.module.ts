import { FeedbackController } from "./feedback.controller";
import { FeedbackRepository } from "./feedback.repository";
import { FeedbackService } from "./feedback.service";

export interface FeedbackModule {
  feedbackRepository: FeedbackRepository;
  feedbackService: FeedbackService;
  feedbackController: FeedbackController;
}

export function createFeedbackModule(): FeedbackModule {
  const feedbackRepository = new FeedbackRepository();
  const feedbackService = new FeedbackService(feedbackRepository);
  const feedbackController = new FeedbackController(feedbackService);
  return { feedbackRepository, feedbackService, feedbackController };
}
