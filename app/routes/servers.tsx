import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { useLoaderData as useRouteData } from "@remix-run/react";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getLfgToonNames, getServers } from "../utils/firebase";
import serverStyleUrl from "../styles/server.css";
import { requireUserSession } from "../utils/session";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: serverStyleUrl }];
};

export const loader: LoaderFunction = async ({ request }) => {
  return requireUserSession(request, async (user) => {
    const servers = await getServers();
    const enhancedServers = await Promise.all(
      servers.map(async (server) => {
        const lfgToonNames = await getLfgToonNames(server.id);
        return {
          ...server,
          lfgToonNames,
        };
      })
    );
    return json({ enhancedServers, user });
  });
};
export default function Servers() {
  const { enhancedServers: servers, user } = useRouteData();
  return (
    <div className="server-page">
      <nav className="server-nav">
        {servers.map((server: any) => (
          <NavLink key={server.id} to={server.id} className="server-nav-link">
            <div className="server-name">{server.name || server.id}</div>
            <div className="server-lfg">
              {server?.lfgToonNames?.length || 0}
            </div>
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}

export function meta() {
  return {
    title: "Dungeon Night Servers",
    description: "List of discord servers supported by the bot.",
  };
}
