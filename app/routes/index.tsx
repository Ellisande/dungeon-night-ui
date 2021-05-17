import { MetaFunction, LinksFunction, LoaderFunction, redirect } from "remix";
import { useRouteData } from "remix";

import stylesUrl from "../styles/index.css";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  return redirect("/servers");
};

export default function Index() {
  let data = useRouteData();

  return <div style={{ textAlign: "center", padding: 20 }}></div>;
}
