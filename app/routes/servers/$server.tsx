import {
  json,
  LoaderFunction,
  useRouteData,
  LinksFunction,
  MetaFunction,
} from "remix";
import ToonRow from "../../components/Toon";
import { Group } from "../../types/Group";
import { Toon } from "../../types/Toon";
import { getLfgToonNames, getGroups, getToon } from "../../utils/firebase";
import toonStylesUrl from "../../styles/toons.css";
import groupStylesUrl from "../../styles/groups.css";
import GroupContainer from "../../components/Group";

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: toonStylesUrl },
    { rel: "stylesheet", href: groupStylesUrl },
  ];
};

export let loader: LoaderFunction = async ({ params }) => {
  const serverId = params.server;
  const lfgToonNames: string[] = await getLfgToonNames(serverId);
  const groups = await getGroups(serverId);
  const toons = await Promise.all(
    lfgToonNames.map(async (name) => {
      return await getToon(serverId, name);
    })
  );
  return json({ lfgToonNames, groups, toons });
  // use db to fetch groups?
  // use db to fetch lfg toons?
  // use db to fetch all toons?
};

const toonFinderFunc = (toons: Toon[]) => (toonName: string) => {
  return toons.find((toon: Toon) => toon.name == toonName) || {};
};

type EnhancedGroup = Group & {
  toons: Toon[];
};

export default function ServerView() {
  const { lfgToonNames, groups, toons } = useRouteData();
  const toonFinder = toonFinderFunc(toons);
  const allLfgToons = lfgToonNames.map(toonFinder);
  const enhancedGroups: EnhancedGroup[] = groups.map((group: Group) => ({
    ...group,
    toons: group.toonNames.map(toonFinder),
  }));
  const groupedToons = enhancedGroups.flatMap((group) => group.toons);
  const waitingToons = allLfgToons.filter(
    (toon: Toon) => !groupedToons.includes(toon)
  );
  return (
    <div>
      <h2>Groups: {groups.length}</h2>
      <div className="groups">
        {enhancedGroups?.length > 0 &&
          enhancedGroups.map((group) => (
            <GroupContainer key={group.id} group={group} toons={group.toons} />
          ))}
        {(!groups || !groups.length) && <div>No Groups Formed Yet</div>}
      </div>
      <h2>Waiting: {waitingToons.length}</h2>
      <div className="lfg-toons">
        {waitingToons.map((toon: Toon) => (
          <ToonRow toon={toon} key={toon.name} showMaxDifficulty showILevel />
        ))}
      </div>
    </div>
  );
}
