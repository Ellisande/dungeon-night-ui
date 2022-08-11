import type { LoaderFunction } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

let secret = "not-at-all-secret";
if (process.env.SESSION_SECRET) {
  secret = process.env.SESSION_SECRET;
} else if (process.env.NODE_ENV === "production") {
  throw new Error("Must set SESSION_SECRET");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      secrets: [secret],
      sameSite: "lax",
      path: "/",
    },
  });

interface UserSession {
  userId: string;
}

const getUserSession = async (request: any): Promise<UserSession> => {
  const session = await getSession(request.headers.get("Cookie"));
  return {
    userId: session.get("userId"),
  };
};

const requireUserSession = async (
  request: any,
  next: (session: UserSession) => ReturnType<LoaderFunction>
) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const userSession = userId ? { userId } : null;
  if (!userSession) {
    return redirect("/login");
  }

  return next(userSession);
};

export {
  getSession,
  commitSession,
  destroySession,
  getUserSession,
  requireUserSession,
};
