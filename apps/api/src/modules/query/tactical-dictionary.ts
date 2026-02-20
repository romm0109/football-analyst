export interface TacticalDictionaryEntry {
  id: string;
  term: string;
  aliases: string[];
  phase: "in_possession" | "out_of_possession" | "transition" | "set_piece";
  widgetPreference: "pitch_zones" | "pass_network" | "xg_timeline" | "pressure_map";
}

const ENTRIES: TacticalDictionaryEntry[] = [
  {
    id: "press",
    term: "high press",
    aliases: ["press", "high pressure", "counter press"],
    phase: "out_of_possession",
    widgetPreference: "pressure_map"
  },
  {
    id: "wide-overload",
    term: "wide channels",
    aliases: ["wide channels", "wings", "half space"],
    phase: "in_possession",
    widgetPreference: "pitch_zones"
  },
  {
    id: "final-third-pass",
    term: "final third passing",
    aliases: ["final third", "progression", "passing lanes"],
    phase: "in_possession",
    widgetPreference: "pass_network"
  },
  {
    id: "xg-trend",
    term: "xg trend",
    aliases: ["xg", "expected goals", "quality chances"],
    phase: "transition",
    widgetPreference: "xg_timeline"
  }
];

export function listTacticalDictionary(): TacticalDictionaryEntry[] {
  return ENTRIES;
}
