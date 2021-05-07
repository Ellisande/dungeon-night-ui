import { LoaderFunction, useRouteData } from "remix";
import firebase from "firebase";

export const loader: LoaderFunction = async () => {
  const snapshot = await firebase
    .firestore()
    .doc("guilds/734593378162835526")
    .get();
  return await snapshot.data;
};
export default function Servers() {
  const data = useRouteData();
  console.log(data);
  return (
    <div>
      <h2>hello world</h2>
    </div>
  );
}

export function meta() {
  return {
    title: "Discord Servers",
    description: "List of discord servers supported by the bot.",
  };
}
