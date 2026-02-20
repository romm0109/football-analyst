import crypto from "node:crypto";
import { FeedbackRatingInput } from "../../../../../libs/shared-types/src";

export interface RatingRecord extends FeedbackRatingInput {
  id: string;
  createdAt: Date;
}

export class FeedbackRepository {
  private readonly ratings: RatingRecord[] = [];

  create(input: FeedbackRatingInput): RatingRecord {
    const record: RatingRecord = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    this.ratings.push(record);
    return record;
  }

  list(): RatingRecord[] {
    return [...this.ratings];
  }
}
