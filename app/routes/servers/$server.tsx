import { json, LoaderFunction, useRouteData } from "remix";
import { getLfgToonNames } from "../../utils/firebase";

export let loader: LoaderFunction = async ({ params }) => {
  const serverId = params.server;
  const lfgToons = await getLfgToonNames(serverId);
  console.log(lfgToons);
  return json(lfgToons);
  // use db to fetch groups?
  // use db to fetch lfg toons?
  // use db to fetch all toons?
};

export default function ServerView() {
  const lfgToonNames: string[] = useRouteData();
  return (
    <div>
      <ul>
        {lfgToonNames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
