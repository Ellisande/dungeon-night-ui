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
export type LfgErrors = {
  noRoles?: string;
  noLevels?: string;
  minimumILevel?: string;
};

export type LfgWarnings = {
  lowILevel?: string;
};

const naughtyBoyMessage = `Listing for keys that your gear is too weak for can negatively impact the group's ability to complete the key. As a courtesy to others, please reduce your maximum key to be sure you're able to contribute to the group.`;

const buildILevelWarningMessage = (
  toonName: string,
  iLevel: number,
  maxLevel: number
) =>
  `${_.capitalize(
    toonName
  )}'s item level is dangerously low for level ${maxLevel} keys. The recommended item level is ${Math.ceil(
    keyLevelCalc(maxLevel)
  )}, and their item level is ${iLevel}. Based on your gear, a level ${recommendedKey(
    iLevel
  )} key is more appropriate.

${naughtyBoyMessage}`;
export const checkLfgReqs = async (serverId: string, toonName: string) => {
  const toon: Toon = (await getToon(serverId, toonName)) as unknown as Toon;
  const errors: LfgErrors = {};
  const warnings: LfgWarnings = {};
  const displayName = _.capitalize(toon.name);
  if (!toon.roles || toon.roles.length == 0) {
    errors.noRoles = `${displayName} must set roles for before joining LFG`;
  }
  if (!toon.iLevel || toon.iLevel < 245) {
    errors.minimumILevel = `${displayName} does not meet the minimum iLevel of 245 for Season 4 keys`;
  }
  if (toon.iLevel < keyLevelCalc(toon.maximumLevel)) {
    warnings.lowILevel = buildILevelWarningMessage(
      toon.name,
      toon.iLevel,
      toon.maximumLevel
    );
  }
  return {
    errors,
    warnings,
  };
};

export const keyLevelCalc = (keyLevel: number) => {
  if (keyLevel < 2) {
    return 245;
  }
  const reqILevel = 245 + (keyLevel - 2) * 2.69;
  return Math.min(reqILevel, 304);
};

export const recommendedKey = (iLevel: number) => {
  if (iLevel >= 304) {
    return 20;
  }
  if (iLevel < 245) {
    return 0;
  }
  return Math.floor((iLevel - 245) / 2.69 + 2);
};
