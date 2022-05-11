import {
  ActionFunction,
  json,
  Link,
  LinksFunction,
  LoaderFunction,
  redirect,
  useRouteData,
} from "remix";
import EditableToon from "../../components/EditableToon";
import GroupContainer from "../../components/Group";
import ToonRow from "../../components/Toon";
import ToonHeaderRow from "../../components/ToonHeaders";
import groupStylesUrl from "../../styles/groups.css";
import toonStylesUrl from "../../styles/toons.css";
import { Group } from "../../types/Group";
import { Role, Toon } from "../../types/Toon";
import {
  addToLfg,
  clearAllGroupsAndLfg,
  getGroups,
  getLfgToonNames,
  getToon,
  getToonsForUser,
  removeFromLfg,
  shuffleGroups,
  updateToon,
} from "../../utils/firebase";
import { getCharacter } from "../../utils/raider";
import { getUserSession, requireUserSession } from "../../utils/session";

type Action = "shuffle" | "end" | "save" | "startLfg" | "endLfg" | "refresh";

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
    const lfgToonNames: string[] = (await getLfgToonNames(serverId)) || [];
    const groups = await getGroups(serverId);
    const toons = await Promise.all(
      lfgToonNames.map(async (name) => {
        return await getToon(serverId, name);
      })
    );
    const userToons = (await getToonsForUser(serverId, userId)) || [];
    return json({ lfgToonNames, groups, toons, userToons, serverId });
  });
};

export let action: ActionFunction = async ({ request }) => {
  let body = Object.fromEntries(new URLSearchParams(await request.text()));

  const serverId: string = body["serverId"];
  const action: Action = body.action as Action;

  if (request.method.toLowerCase() == "post" && action == "save") {
    const { userId } = await getUserSession(request);
    const name = body.name as string;
    const tank = body.tank ? "tank" : null;
    const dps = body.dps ? "dps" : null;
    const healer = body.healer ? "healer" : null;
    const roles: Role[] = [tank, dps, healer]
      .filter((i) => i)
      .map((i) => i as Role);
    const maxDifficulty = Number(body.maxDifficulty);
    const toonUpdates = {
      roles,
      minimumLevel: 2,
      maximumLevel: maxDifficulty,
    };
    try {
      await updateToon(serverId, name, userId, toonUpdates);
    } catch {
      return redirect(`/servers/${serverId}`);
    }
  }
  if (request.method.toLowerCase() == "post" && action == "startLfg") {
    const toonName = body.name as string;

    await addToLfg(serverId, toonName);
  }
  if (request.method.toLowerCase() == "post" && action == "endLfg") {
    const toonName = body.name as string;

    await removeFromLfg(serverId, toonName);
  }
  if (request.method.toLowerCase() == "post" && action == "shuffle") {
    await shuffleGroups(serverId);
  }
  if (request.method.toLowerCase() == "post" && action == "end") {
    await clearAllGroupsAndLfg(serverId);
  }
  if (request.method.toLowerCase() == "post" && action == "refresh") {
    const name = body.name as string;
    const realm = body.realm as string;
    const { userId } = await getUserSession(request);
    try {
      const raiderToon = await getCharacter(name, realm);
      await updateToon(serverId, name, userId, raiderToon);
    } catch (e) {}
  }

  return redirect(`/servers/${serverId}`);
};

const toonFinderFunc = (toons: Toon[]) => (toonName: string) => {
  return toons.find((toon: Toon) => toon.name == toonName);
};

type EnhancedGroup = Group & {
  toons: (Toon | string)[];
};

export default function ServerView() {
  const {
    lfgToonNames = [],
    groups = [],
    toons = [],
    userToons = [],
    serverId,
  } = useRouteData();

  const toonFinder = toonFinderFunc(toons);
  const allLfgToons = lfgToonNames.map(toonFinder);
  const enhancedGroups: EnhancedGroup[] = groups.map((group: Group) => ({
    ...group,
    toons: group.toonNames.map((name) => toonFinder(name) || name),
  }));
  const groupedToons = enhancedGroups.flatMap((group) =>
    group.toons.filter((i) => typeof i != "string")
  );
  const waitingToons = allLfgToons.filter(
    (toon: Toon) => !groupedToons.includes(toon)
  );

  return (
    <div className="groups-layout">
      <h2>Groups: {groups.length}</h2>
      <div className="group-actions">
        <form method="post">
          <input type="hidden" name="serverId" value={serverId} />
          <input type="hidden" name="action" value="shuffle" />
          <button type="submit" className="claim button">
            Shuffle Groups
          </button>
        </form>
        <form method="post">
          <input type="hidden" name="serverId" value={serverId} />
          <input type="hidden" name="action" value="end" />
          <button type="submit" className="end button">
            End the Night
          </button>
        </form>
      </div>
      <div className="groups">
        {enhancedGroups?.length > 0 &&
          enhancedGroups.map((group) => (
            <GroupContainer key={group.id} group={group} toons={group.toons} />
          ))}
        {(!groups || !groups.length) && <div>No Groups Formed Yet</div>}
      </div>
      <h2>Waiting: {waitingToons.length}</h2>
      <div className="lfg-toons">
        {waitingToons.length > 0 && (
          <ToonHeaderRow showMaxDifficulty showILevel />
        )}
        {waitingToons.map((toon: Toon) => (
          <ToonRow toon={toon} key={toon.name} showMaxDifficulty showILevel />
        ))}
        {!waitingToons?.length && <div>No toons currently lfg</div>}
      </div>
      <h2>Your Characters</h2>
      {userToons?.length > 0 && (
        <div className="characters">
          {userToons.map((toon: Toon) => (
            <EditableToon
              key={toon.name}
              toon={toon}
              serverId={serverId}
              lfg={lfgToonNames.includes(toon.name)}
            />
          ))}
        </div>
      )}
      {!userToons ||
        (!userToons.length && "You have no characters on this server")}
      <div className="server-actions">
        <Link to={`claim`} className="claim button">
          Claim A Character
        </Link>
        <Link to="create" className="create button">
          Add a New Character
        </Link>
      </div>
    </div>
  );
}
