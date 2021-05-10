export type Toon = {
  name: string;
  roles: Role[];
  iLevel: number;
  difficulties: string[];
  userId?: string;
};

type Role = "tank" | "dps" | "healer";
