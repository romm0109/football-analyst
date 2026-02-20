import { QueryIntent } from "../../../../../libs/shared-types/src";
import {
  listTacticalDictionary,
  TacticalDictionaryEntry,
} from "./tactical-dictionary";

type QueryPhase = QueryIntent["phase"];

function findMinuteRange(question: string): QueryIntent["minuteRange"] {
  const match = question.match(/(\d{1,2})\s*-\s*(\d{1,2})/);
  if (!match) {
    return undefined;
  }
  const from = Number(match[1]);
  const to = Number(match[2]);
  if (Number.isNaN(from) || Number.isNaN(to)) {
    return undefined;
  }
  return { from, to };
}

function findPhaseHint(question: string): QueryPhase | null {
  if (/out[-\s]?of[-\s]?possession|defend|press|pressure/.test(question)) {
    return "out_of_possession";
  }
  if (/transition|counter|counterattack/.test(question)) {
    return "transition";
  }
  if (/set[-\s]?piece|corner|free kick|throw[-\s]?in/.test(question)) {
    return "set_piece";
  }
  if (
    /in[-\s]?possession|build[-\s]?up|passing|chance creation/.test(question)
  ) {
    return "in_possession";
  }
  return null;
}

function buildRuleIntent(
  normalizedQuestion: string,
  matches: TacticalDictionaryEntry[],
): QueryIntent {
  if (matches.length !== 1) {
    return {
      tacticalConcept: matches.length > 1 ? "multi_concept" : "unknown",
      phase: "in_possession",
      minuteRange: findMinuteRange(normalizedQuestion),
      ambiguous: true,
      ambiguityReason:
        matches.length > 1
          ? "multiple_tactical_concepts_detected"
          : "unknown_tactical_concept",
    };
  }

  return {
    tacticalConcept: matches[0].term,
    phase: matches[0].phase,
    minuteRange: findMinuteRange(normalizedQuestion),
    ambiguous: false,
    ambiguityReason: null,
  };
}

function buildHeuristicLlmIntent(normalizedQuestion: string): QueryIntent {
  const phaseHint = findPhaseHint(normalizedQuestion);
  const hasQuestionMark = normalizedQuestion.includes("?");
  const hasTacticalSignal =
    /press|xg|expected goals|channels|wings|passing|transition|set piece/.test(
      normalizedQuestion,
    );

  return {
    tacticalConcept: hasTacticalSignal
      ? "llm_inferred_tactical_pattern"
      : "unknown",
    phase: phaseHint ?? "in_possession",
    minuteRange: findMinuteRange(normalizedQuestion),
    ambiguous: !hasTacticalSignal && hasQuestionMark,
    ambiguityReason:
      !hasTacticalSignal && hasQuestionMark ? "llm_low_signal" : null,
  };
}

function reconcileIntent(
  ruleIntent: QueryIntent,
  llmIntent: QueryIntent,
): QueryIntent {
  if (!ruleIntent.ambiguous) {
    return {
      ...ruleIntent,
      minuteRange: ruleIntent.minuteRange ?? llmIntent.minuteRange,
    };
  }

  if (!llmIntent.ambiguous && llmIntent.tacticalConcept !== "unknown") {
    return {
      ...llmIntent,
      tacticalConcept: llmIntent.tacticalConcept,
      ambiguityReason: null,
      ambiguous: false,
    };
  }

  return {
    ...ruleIntent,
    phase: llmIntent.phase ?? ruleIntent.phase,
    minuteRange: ruleIntent.minuteRange ?? llmIntent.minuteRange,
  };
}

export interface ParseResult {
  intent: QueryIntent;
  matchedEntry: TacticalDictionaryEntry | null;
}

export class ParseService {
  private readonly dictionary = listTacticalDictionary();

  parse(question: string): ParseResult {
    const normalized = question.toLowerCase();
    const matches = this.dictionary.filter((entry) =>
      [entry.term, ...entry.aliases].some((token) =>
        normalized.includes(token.toLowerCase()),
      ),
    );
    const ruleIntent = buildRuleIntent(normalized, matches);
    const llmIntent = buildHeuristicLlmIntent(normalized);
    const intent = reconcileIntent(ruleIntent, llmIntent);

    return {
      intent,
      matchedEntry: matches.length === 1 ? matches[0] : null,
    };
  }
}
