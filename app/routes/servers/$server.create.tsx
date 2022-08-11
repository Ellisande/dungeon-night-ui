import { useLoaderData as useRouteData } from "@remix-run/react";
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import createStyle from "../../styles/create.css";
import type { Server } from "../../types/Server";
import { createToonFromRaider, getServers } from "../../utils/firebase";
import type { RaiderCharacter } from "../../utils/raider";
import { getCharacter } from "../../utils/raider";
import { getUserSession } from "../../utils/session";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: createStyle }];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { server: serverId } = params;
  const url = new URL(request.url);
  const toonName = url.searchParams.get("toonName");
  const realm = url.searchParams.get("realm");
  const servers = await getServers();
  const server = servers.find((serv: Server) => serv.id == serverId);
  let raiderToon: RaiderCharacter | null = null;
  let hasFetchError: boolean = false;
  if (toonName && realm) {
    try {
      raiderToon = await getCharacter(toonName, realm);
    } catch (e) {
      hasFetchError = true;
    }
  }
  return json({ server, raiderToon, toonName, realm, hasFetchError });
};

export const action: ActionFunction = async ({ request }) => {
  let data = Object.fromEntries(new URLSearchParams(await request.text()));
  const serverId = data.serverId;
  const toonName = data.toonName?.toLowerCase();
  const realm = data.realm.toLowerCase();
  const userSession = await getUserSession(request);
  const userId = userSession.userId;
  const toon: RaiderCharacter = {
    name: toonName,
    iLevel: parseInt(data.iLevel, 10),
    mythicScore: parseInt(data.mythicScore),
    averageHighestRun: parseInt(data.averageHighestRun),
    realm,
  };
  await createToonFromRaider(serverId, userId, toon);
  return redirect(`/servers/${serverId}`);
};

export default function CreateToon() {
  const { server, raiderToon, toonName, realm, hasFetchError } = useRouteData();
  const toonFetched = !!raiderToon;
  return (
    <div>
      <form method="get" className="create-layout">
        <h2>{server.name}</h2>
        <input type="hidden" name="serverId" value={server.id} />
        <fieldset>
          <label htmlFor="toonName">Character Name</label>
          <input
            type="text"
            name="toonName"
            id="toonName"
            className="toon-name"
            pattern="[^ ]*"
            defaultValue={toonName}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="realm">Realm</label>
          <input
            type="text"
            name="realm"
            defaultValue={realm}
            className="toon-name"
            id="realm"
          />
        </fieldset>

        <button type="submit" className="button fetch">
          Fetch
        </button>
      </form>
      {hasFetchError && (
        <div className="create-layout">
          <strong>Failed to load character</strong>
        </div>
      )}
      {toonFetched && (
        <form method="post" className="create-layout">
          <div>
            <strong>Loaded Character</strong>
          </div>
          <input type="hidden" name="serverId" value={server.id} />
          <input
            type="hidden"
            name="toonName"
            value={raiderToon.name}
            id="newToonName"
          />
          <input
            type="hidden"
            name="iLevel"
            value={raiderToon.iLevel}
            id="newItemLevel"
          />
          <input
            type="hidden"
            name="mythicScore"
            value={raiderToon.mythicScore}
            id="mythicScore"
          />
          <input
            type="hidden"
            name="averageHighestRun"
            value={raiderToon.averageHighestRun}
          />
          <input type="hidden" name="realm" value={raiderToon.realm} />
          <div className="character-display">
            <span>Name</span>
            <span>{raiderToon.name}</span>
            <span>ILevel</span>
            <span>{raiderToon.iLevel}</span>
            <span>Score</span>
            <span>{raiderToon.mythicScore}</span>
            <span>Avg Best Dungeon</span>
            <span>{raiderToon.averageHighestRun}</span>
          </div>
          <button type="submit" className="button create">
            This is my character
          </button>
        </form>
      )}
    </div>
  );
}
