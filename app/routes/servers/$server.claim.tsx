import { useLoaderData as useRouteData } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderFunction,
  LinksFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Server } from "../../types/Server";
import type { Toon } from "../../types/Toon";
import { claimToon, getServers, getUnclaimedToons } from "../../utils/firebase";
import { getUserSession } from "../../utils/session";
import claimStyles from "../../styles/claim.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: claimStyles }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { server: serverId } = params;
  if (!serverId) {
    return json({ error: true });
  }
  const servers = await getServers();
  const server = servers.find((serv: Server) => serv.id == serverId);
  const unclaimedToons = await getUnclaimedToons(serverId);
  return json({ server, unclaimedToons });
};

export const action: ActionFunction = async ({ request }) => {
  let data = Object.fromEntries(new URLSearchParams(await request.text()));
  const serverId = data.serverId;
  const toonName = data.name;
  const userSession = await getUserSession(request);
  const userId = userSession.userId;
  await claimToon(serverId, userId, toonName);
  return redirect(`/servers/${serverId}`);
};

export default function ClaimToon() {
  const { server, unclaimedToons } = useRouteData();
  return (
    <form method="post" className="claim-layout">
      <h2>{server.name}</h2>
      <input type="hidden" name="serverId" value={server.id} />
      <select name="name" className="toon-select">
        {unclaimedToons.map((toon: Toon) => (
          <option key={toon.name} value={toon.name}>
            {toon.name}
          </option>
        ))}
      </select>
      <button type="submit" className="button claim-toon">
        This is my character!
      </button>
    </form>
  );
}
