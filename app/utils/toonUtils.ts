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
