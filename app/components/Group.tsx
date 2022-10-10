import type { Group } from "../types/Group";
import type { Toon } from "../types/Toon";
import Difficulty from "./Difficulty";
import ToonRow from "./Toon";

type Props = {
  group: Group;
  toons?: (Toon | string)[];
};

const toonOrNameMapper = (toonOrName: Toon | string) => {
  if (typeof toonOrName == "string") {
    return <div className="toon-name">{toonOrName}</div>;
  }
  const toon = toonOrName as Toon;
  return <ToonRow key={toon.name} toon={toon} />;
};

export default function GroupContainer(props: Props) {
  const { group, toons = [] } = props;
  return (
    <div className="group">
      <div className="group-id">Group {group.id}</div>
      <div className="group-full">{group.full ? "Full" : ""}</div>
      <div className="group-members">
        {!toons.length &&
          group.toonNames.map((toonName) => (
            <div key={toonName} className="toon-name">
              {toonName}
            </div>
          ))}
        {toons.length > 0 && toons.map(toonOrNameMapper)}
      </div>
    </div>
  );
}
