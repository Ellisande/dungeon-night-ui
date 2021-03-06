export type Toon = {
  name: string;
  roles: Role[];
  iLevel: number;
  difficulties: string[];
  userId?: string;
  maximumLevel: number;
  minimumLevel: number;
  realm?: string;
  averageHighestRun?: number;
  mythicScore?: number;
};

type Role = "tank" | "dps" | "healer";
