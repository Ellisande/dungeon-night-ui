import { Link, MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return { title: "Ain't nothing here" };
};

export default function FourOhFour() {
  return (
    <div>
      <h1>These are not the pages you are looking for.</h1>
      <p>Try starting again</p>
      <Link to="/servers">Browse Servers</Link>
    </div>
  );
}
