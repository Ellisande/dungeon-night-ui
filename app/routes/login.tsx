import * as React from "react";
import type { ActionFunction, LoaderFunction, LinksFunction } from "remix";
import { useRouteData, json, redirect } from "remix";
import { useAuthenticated } from "../hooks/useAuthenticated";
import { useSignIn } from "../hooks/useSignIn";
import { commitSession, getSession } from "../utils/session";
import loginStyles from "../styles/login.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: loginStyles }];
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const { userId } = Object.fromEntries(
    new URLSearchParams(await request.text())
  );

  session.set("userId", userId);
  return redirect("/servers", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

function Login() {
  const data = useRouteData();

  const userId = useAuthenticated();
  const signIn = useSignIn();
  return (
    <>
      {!userId && (
        <div className="login-layout">
          <button onClick={signIn} className="button login">
            Sign In
          </button>
        </div>
      )}
      {userId && (
        <form method="post" className="login-layout">
          <div className="with-google">Signed in With Google!</div>
          <input type="hidden" value={userId} name="userId" />
          <button className="button continue">Continue</button>
        </form>
      )}
    </>
  );
}

export default Login;
