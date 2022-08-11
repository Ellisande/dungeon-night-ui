import type { Toon } from "./../types/Toon.d";
import _ from "lodash";
import { getToon } from "./firebase";

export function getMaxDifficulty(difficulties: string[]) {
  const mythicPlus = difficulties.filter((difficulty) =>
    /m\d+/.test(difficulty)
  );
  if (mythicPlus.length > 0) {
    const mPlusNumbers = mythicPlus
      .map((difficulty) => difficulty.replace(/m/i, ""))
      .map(Number);
    return "m" + Math.max(...mPlusNumbers);
  }

  if (difficulties.includes("mythic")) {
    return "mythic";
  }
  if (difficulties.includes("heroic")) {
    return "heroic";
  }
  return "normal";
}

export const getAllDifficultiesLessThan = (difficultyIndex: number) => {
  if (difficultyIndex < 0 || difficultyIndex > difficultyMap.length - 1) {
    return [];
  }
  return difficultyMap.slice(0, difficultyIndex + 1);
};

const difficultyMap = [
  "normal",
  "heroic",
  "mythic",
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "m8",
  "m9",
  "m10",
  "m11",
  "m12",
  "m13",
  "m14",
  "m15",
  "m16",
  "m17",
  "m18",
  "m19",
  "m20",
];

const keyLevelCalc = (level: number) => {
  if (level < 2) {
    return 245;
  }
  if (level < 16) {
    return 245 + (level - 2) * 3.5;
  }
  return 290;
};

export type LfgErrors = {
  noRoles?: string;
  noLevels?: string;
  minimumILevel?: string;
};

export type LfgWarnings = {
  lowILevel?: string;
};

export const checkLfgReqs = async (serverId: string, toonName: string) => {
  const toon: Toon = (await getToon(serverId, toonName)) as unknown as Toon;
  const errors: LfgErrors = {};
  const warnings: LfgWarnings = {};
  const displayName = _.capitalize(toon.name);
  if (!toon.minimumLevel || !toon.maximumLevel) {
    errors.noLevels = `${displayName} must set key levels to join LFG `;
  }
  if (!toon.roles || toon.roles.length == 0) {
    errors.noRoles = `${displayName} must set roles for before joining LFG`;
  }
  if (!toon.iLevel || toon.iLevel < 245) {
    errors.minimumILevel = `${displayName} does not meet the minimum iLevel of 245 for Season 4 keys`;
  }
  if (toon.iLevel < keyLevelCalc(toon.maximumLevel)) {
    warnings.lowILevel = `${displayName}'s item level is dangerously low for level ${
      toon.maximumLevel
    } keys recommended item level is ${Math.ceil(
      keyLevelCalc(toon.maximumLevel)
    )}`;
  }
  return {
    errors,
    warnings,
  };
};
