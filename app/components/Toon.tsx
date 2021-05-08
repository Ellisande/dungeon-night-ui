import type { Role, Toon } from "../types/Toon";
import Difficulty from "./Difficulty";

type Props = {
  toon: Toon;
  className?: string;
  showMaxDifficulty?: boolean;
  showILevel?: boolean;
};

function HealerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 toon-role healer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function DpsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 toon-role dps"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
      />
    </svg>
  );
}

function TankIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 toon-role tank"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

const iconMap = {
  tank: TankIcon,
  dps: DpsIcon,
  healer: HealerIcon,
};

function roleMapper(role: Role) {
  const Icon = iconMap[role];
  return <Icon key={role} />;
}

function getMaxDifficulty(difficulties: string[]) {
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
