import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useRouteData,
} from "remix";
import { Server } from "../../types/Server";
import { Toon } from "../../types/Toon";
import { claimToon, getServers, getUnclaimedToons } from "../../utils/firebase";
import { getUserSession } from "../../utils/session";

export const loader: LoaderFunction = async ({ params }) => {
  const { server: serverId } = params;
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
    <form method="post">
      <div>{server.name}</div>
      <input type="hidden" name="serverId" value={server.id} />
      <select name="name">
        {unclaimedToons.map((toon: Toon) => (
          <option key={toon.name} value={toon.name}>
            {toon.name}
          </option>
        ))}
      </select>
      <button type="submit">This is my character!</button>
    </form>
  );
}
