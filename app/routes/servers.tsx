import { Outlet } from "react-router";
import { json, Link, LoaderFunction, useRouteData } from "remix";
import { getServers } from "../utils/firebase";

export const loader: LoaderFunction = async () => {
  const servers = await getServers();
  return json(servers);
};
export default function Servers() {
  const servers: Server[] = useRouteData();
  console.log(servers);
  return (
    <div>
      <aside>
        {servers.map((server) => (
          <div key={server.id}>
            <Link to={server.id}>{server.name}</Link>
          </div>
        ))}
      </aside>
      <Outlet />
    </div>
  );
}

export function meta() {
  return {
    title: "Discord Servers",
    description: "List of discord servers supported by the bot.",
  };
}
