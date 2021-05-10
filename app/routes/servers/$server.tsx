import {
  json,
  LoaderFunction,
  useRouteData,
  LinksFunction,
  MetaFunction,
  ActionFunction,
  redirect,
} from "remix";
import ToonRow from "../../components/Toon";
import { Group } from "../../types/Group";
import { Role, Toon } from "../../types/Toon";
import {
  getLfgToonNames,
  getGroups,
  getToon,
  getToonsForUser,
  updateToon,
  getAuth,
} from "../../utils/firebase";
import toonStylesUrl from "../../styles/toons.css";
import groupStylesUrl from "../../styles/groups.css";
import GroupContainer from "../../components/Group";
import EditableToonRow from "../../components/EditableToon";
import { Authenticated } from "../../components/Authenticated";
import { useAuthenticated } from "../../hooks/useAuthenticated";
import { getUserSession, requireUserSession } from "../../utils/session";

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: toonStylesUrl },
    { rel: "stylesheet", href: groupStylesUrl },
  ];
};

export let loader: LoaderFunction = async ({ params, request }) => {
  return requireUserSession(request, async (session) => {
    const userId = session.userId;
    const serverId = params.server;
    const lfgToonNames: string[] = await getLfgToonNames(serverId);
    const groups = await getGroups(serverId);
    const toons = await Promise.all(
      lfgToonNames.map(async (name) => {
        return await getToon(serverId, name);
      })
    );
    const userToons = await getToonsForUser(serverId, userId);
    return json({ lfgToonNames, groups, toons, userToons, serverId });
  });

  // use db to fetch groups?
  // use db to fetch lfg toons?
  // use db to fetch all toons?
};

export let action: ActionFunction = async ({ request, context }) => {
  let body = new URLSearchParams(await request.text());
  const { userId } = await getUserSession(request);
  const name = body.get("name") as string;
  const tank = body.get("tank") ? "tank" : null;
  const dps = body.get("dps") ? "dps" : null;
  const healer = body.get("healer") ? "healer" : null;
  const iLevel = Number(body.get("iLevel"));
  const serverId = body.get("server-id") as string;
  const roles: Role[] = [tank, dps, healer]
    .filter((i) => i)
    .map((i) => i as Role);
  const toonUpdates = {
    roles,
    iLevel,
  };
  try {
    await updateToon(serverId, name, userId, toonUpdates);
  } catch {
    redirect(`/servers/${serverId}`);
  }
  return redirect(`/servers/${serverId}`);
};

const toonFinderFunc = (toons: Toon[]) => (toonName: string) => {
  return toons.find((toon: Toon) => toon.name == toonName) || {};
};

type EnhancedGroup = Group & {
  toons: Toon[];
};

export default function ServerView() {
  const { lfgToonNames, groups, toons, userToons, serverId } = useRouteData();
  const userId = useAuthenticated();
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
      <h2>Your Characters</h2>
      {userToons?.length > 0 && (
        <div className="characters">
          {userToons.map((toon: Toon) => (
            <EditableToonRow key={toon.name} toon={toon} serverId={serverId} />
          ))}
        </div>
      )}
      {!userToons ||
        (!userToons.length && "You have no characters on this server")}
    </div>
  );
}
