import { FeedbackRatingInput } from "../../../../../libs/shared-types/src";
import { FeedbackRepository } from "./feedback.repository";

export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  submit(input: FeedbackRatingInput): void {
    if (input.score < 1 || input.score > 5) {
      throw new Error("invalid_score");
    }
    this.feedbackRepository.create(input);
  }

  summary(): { totalRatings: number; averageScore: number } {
    const ratings = this.feedbackRepository.list();
    if (!ratings.length) {
      return { totalRatings: 0, averageScore: 0 };
    }
    const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
    return {
      totalRatings: ratings.length,
      averageScore: Number((sum / ratings.length).toFixed(2))
    };
  }
}
