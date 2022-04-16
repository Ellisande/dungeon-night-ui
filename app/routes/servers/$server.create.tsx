import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useRouteData,
  LinksFunction,
} from "remix";
import { Server } from "../../types/Server";
import { createToon, getServers } from "../../utils/firebase";
import { getUserSession } from "../../utils/session";
import createStyle from "../../styles/create.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: createStyle }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { server: serverId } = params;
  const servers = await getServers();
  const server = servers.find((serv: Server) => serv.id == serverId);
  return json({ server });
};

export const action: ActionFunction = async ({ request }) => {
  let data = Object.fromEntries(new URLSearchParams(await request.text()));
  const serverId = data.serverId;
  const toonName = data.newToonName?.toLowerCase();
  const userSession = await getUserSession(request);
  const userId = userSession.userId;
  await createToon(serverId, userId, toonName);
  return redirect(`/servers/${serverId}`);
};

export default function CreateToon() {
  const { server } = useRouteData();
  return (
    <form method="post" className="create-layout">
      <h2>{server.name}</h2>
      <input type="hidden" name="serverId" value={server.id} />
      <input
        type="text"
        name="newToonName"
        className="toon-name"
        pattern="[^ ]*"
      />
      <button type="submit" className="button create-toon">
        Create New Toon
      </button>
    </form>
  );
}
