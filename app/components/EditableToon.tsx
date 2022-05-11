import { useState } from "react";
import type { Toon } from "../types/Toon";
import DpsIcon from "./DpsIcon";
import HealerIcon from "./HealerIcon";
import RefreshIcon from "./RefreshIcon";
import TankIcon from "./TankIcon";
import UpdateIcon from "./UpdateIcon";

type Props = {
  toon: Toon;
  serverId: string;
  className?: string;
  lfg?: boolean;
};

export default function EditableToon(props: Props) {
  const { toon, serverId, lfg = false } = props;
  const { name } = toon;
  const maxDifficulty = toon.maximumLevel || 2;
  const [difficultyValue, setDifficultyValue] = useState(maxDifficulty);
  const difficultyText =
    difficultyValue < 10 ? "0" + difficultyValue : difficultyValue;
  const lfgStyle = lfg ? "lfg" : "";
  const maxKey = (toon.averageHighest || 0) + 2;
  return (
    <div className={"toon-rows-layout " + lfgStyle}>
      <div className="toon-edit-row info-row">
        <div className="toon-name">
          <strong>{toon.name}</strong>
        </div>
        <div className="label-pair">
          <div>iLevel</div>
          <div>{toon.iLevel || 0}</div>
        </div>
        <div className="label-pair">
          <div>score</div>
          <div>{toon.mythicScore || 0}</div>
        </div>
        <div className="label-pair">
          <div>max key</div>
          <div>{maxKey}</div>
        </div>
        <form method="post" className="refresh">
          <input type="hidden" name="serverId" value={serverId} />
          <input type="hidden" name="name" value={toon.name} />
          <input type="hidden" name="action" value="refresh" />
          <input type="hidden" name="realm" value={toon.realm} />
          <button className="button refresh">
            <RefreshIcon />
          </button>
        </form>
      </div>
      <form method="post" className="toon-edit-row">
        <input type="hidden" name="serverId" value={serverId} />
        <input type="hidden" name="name" value={toon.name} />
        <input type="hidden" name="action" value="save" />
        <div className="roles">
          <div className="tank-container">
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
          <div className="dps-container">
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
          <div className="healer-container">
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
        </div>

        <div className="difficulty">
          <span>Keys</span>
          <div className="difficulty-number">+{difficultyText}</div>
          <input
            type="range"
            min="2"
            max={maxKey}
            value={difficultyValue}
            className="maxDifficulty"
            id="maxDifficulty"
            name="maxDifficulty"
            onChange={(e) => setDifficultyValue(Number(e.target.value))}
          />
        </div>
        <div className="">
          <button type="submit" className="button save">
            <UpdateIcon />
          </button>
        </div>
      </form>
      <div className="toon-edit-row lfg-row">
        {!lfg && (
          <form method="post">
            <input type="hidden" name="serverId" value={serverId} />
            <input type="hidden" name="action" value="startLfg" />
            <input type="hidden" name="name" value={toon.name} />
            <button type="submit" className="button lfg start">
              Set LFG
            </button>
          </form>
        )}
        {lfg && (
          <form method="post">
            <input type="hidden" name="serverId" value={serverId} />
            <input type="hidden" name="action" value="endLfg" />
            <input type="hidden" name="name" value={toon.name} />
            <button type="submit" className="button stop lfg">
              Stop LFG
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
