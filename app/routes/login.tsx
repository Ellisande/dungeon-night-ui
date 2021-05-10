import * as React from "react";
import type { ActionFunction, LoaderFunction } from "remix";
import { useRouteData, json, redirect } from "remix";
import { useAuthenticated } from "../hooks/useAuthenticated";
import { useSignIn } from "../hooks/useSignIn";
import { commitSession, getSession } from "../utils/session";

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
    <div>
      {!userId && <button onClick={signIn}>Sign In</button>}
      {userId && (
        <form method="post">
          <div>Signed in With Google!</div>
          <input type="hidden" value={userId} name="userId" />
          <button>Continue</button>
        </form>
      )}
    </div>
  );
}

export default Login;
