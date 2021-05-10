import type { Role, Toon } from "../types/Toon";
import Difficulty from "./Difficulty";
import DpsIcon from "./DpsIcon";
import HealerIcon from "./HealerIcon";
import TankIcon from "./TankIcon";

type Props = {
  toon: Toon;
  className?: string;
  showMaxDifficulty?: boolean;
  showILevel?: boolean;
};

const iconMap = {
  tank: TankIcon,
  dps: DpsIcon,
  healer: HealerIcon,
};

function roleMapper(role: Role) {
  const Icon = iconMap[role];
  return <Icon key={role} />;
}

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

export default function ToonRow(props: Props) {
  const {
    toon,
    className,
    showMaxDifficulty = false,
    showILevel = false,
  } = props;
  return (
    <div className={`toon ${className}`}>
      <div className="toon-name">{toon.name}</div>
      <div className="toon-roles">{toon.roles.map(roleMapper)}</div>
      {showMaxDifficulty && (
        <div className="toon-max-difficulty">
          <Difficulty difficulty={getMaxDifficulty(toon.difficulties)} />
        </div>
      )}
      {showILevel && <div className="toon-ilevel">{toon.iLevel}</div>}
    </div>
  );
}
