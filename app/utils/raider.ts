import { useAuthEmulator } from "firebase/auth";

export type RaiderCharacter = {
  name: string;
  iLevel: number;
  averageHighestRun?: number;
  mythicScore: number;
  realm: string;
};

const fields = [
  "gear",
  "mythic_plus_scores_by_season:current",
  "mythic_plus_highest_level_runs",
];
const baseUrl = "https://raider.io/api/v1/";

const characterUrl = "characters/profile?";

export async function getCharacter(
  name: string,
  realm: string
): Promise<RaiderCharacter> {
  const params = new URLSearchParams({
    region: "us",
    realm,
    name,
    fields: fields.join(","),
  });
  const url = baseUrl + characterUrl + params.toString();
  const response = await fetch(url);
  const responseToon = await response.json();
  const seasonScores = responseToon.mythic_plus_scores_by_season[0];
  const highestRuns = responseToon.mythic_plus_highest_level_runs
    .map((dungeon: any) => dungeon.mythic_level)
    .sort();
  let averageHighest =
    highestRuns.reduce((sum: number, level: number) => sum + level, 0) /
    highestRuns.length;
  averageHighest = Math.round(averageHighest);
  const mythicScore = Math.round(seasonScores.scores?.all);
  return {
    name: responseToon.name.toLowerCase(),
    mythicScore: mythicScore,
    iLevel: responseToon.gear.item_level_equipped,
    averageHighestRun: averageHighest,
    realm: realm.toLowerCase(),
  };
}
