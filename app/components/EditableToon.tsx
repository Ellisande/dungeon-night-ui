import { createRef, useState } from "react";
import { ActionFunction, Form, redirect } from "remix";
import type { Role, Toon } from "../types/Toon";
import { getMaxDifficulty } from "../utils/toonUtils";
import Difficulty from "./Difficulty";
import DpsIcon from "./DpsIcon";
import HealerIcon from "./HealerIcon";
import TankIcon from "./TankIcon";

type Props = {
  toon: Toon;
  serverId: string;
  className?: string;
  lfg?: boolean;
};

const iconMap = {
  tank: TankIcon,
  dps: DpsIcon,
  healer: HealerIcon,
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

export default function EditableToonRow(props: Props) {
  const { toon, className, serverId, lfg = false } = props;
  const { name } = toon;
  const maxDifficulty = getMaxDifficulty(toon.difficulties);
  const maxDifficultyValue = difficultyMap.indexOf(maxDifficulty);
  const sanitizedMaxDifficultyValue =
    maxDifficultyValue == -1 ? 0 : maxDifficultyValue;
  const [difficultyValue, setDifficultyValue] = useState(
    sanitizedMaxDifficultyValue
  );
  const difficultyText = difficultyMap[difficultyValue] || "normal";
  return (
    <div className="toon-edit-layout">
      <Form className={`toon-editable ${className}`} method="post">
        <div className="toon-name">{toon.name}</div>
        <div>
          <input
            className="toon-roles"
            type="checkbox"
            name="tank"
            id={`${name}-tank`}
            defaultChecked={toon.roles.includes("tank")}
          />
          <label htmlFor={`${name}-tank`} className="role-icon-label">
            <TankIcon />
          </label>
        </div>
        <div>
          <input
            className="toon-roles"
            type="checkbox"
            name="dps"
            id={`${name}-dps`}
            defaultChecked={toon.roles.includes("dps")}
          />
          <label htmlFor={`${name}-dps`} className="role-icon-label">
            <DpsIcon />
          </label>
        </div>
        <div>
          <input
            className="toon-roles"
            type="checkbox"
            name="healer"
            id={`${name}-healer`}
            defaultChecked={toon.roles.includes("healer")}
          />
          <label htmlFor={`${name}-healer`} className="role-icon-label">
            <HealerIcon />
          </label>
        </div>
        <input
          name="iLevel"
          className="toon-ilevel"
          type="text"
          defaultValue={Number(toon.iLevel)}
          min={0}
          max={235}
        />
        <input type="hidden" name="name" value={toon.name} />
        <input type="hidden" name="server-id" value={serverId} />
        <span>{difficultyText}</span>
        <input
          type="range"
          min="0"
          max="21"
          value={difficultyValue}
          className="maxDifficulty"
          id="maxDifficulty"
          name="maxDifficulty"
          onChange={(e) => setDifficultyValue(Number(e.target.value))}
        />
        <button type="submit">Update</button>
      </Form>
      {!lfg && (
        <Form method="put">
          <input type="hidden" name="server-id" value={serverId} />

          <input type="hidden" name="name" value={toon.name} />
          <button type="submit">Go LFG</button>
        </Form>
      )}
      {lfg && (
        <Form method="delete">
          <input type="hidden" name="server-id" value={serverId} />

          <input type="hidden" name="name" value={toon.name} />
          <button type="submit">Leave LFG</button>
        </Form>
      )}
    </div>
  );
}
