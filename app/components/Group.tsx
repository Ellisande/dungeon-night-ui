import { Group } from "../types/Group";
import { Toon } from "../types/Toon";
import Difficulty from "./Difficulty";
import ToonRow from "./Toon";

type Props = {
  group: Group;
  toons?: Toon[];
};

export default function GroupContainer(props: Props) {
  const { group, toons = [] } = props;
  return (
    <div className="group">
      <div className="group-id">Group {group.id}</div>
      <div className="group-difficulty">
        <Difficulty difficulty={group.difficulty} />
      </div>
      <div className="group-full">{group.full ? "Full" : ""}</div>
      <div className="group-members">
        {!toons.length &&
          group.toonNames.map((toonName) => (
            <div key={toonName} className="toon-name">
              {toonName}
            </div>
          ))}
        {toons.length > 0 &&
          toons.map((toon) => <ToonRow key={toon.name} toon={toon} />)}
      </div>
    </div>
  );
}
