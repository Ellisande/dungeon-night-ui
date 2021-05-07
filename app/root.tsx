import type { LinksFunction, LoaderFunction } from "remix";
import { Meta, Links, Scripts, useRouteData, LiveReload } from "remix";
import { Outlet } from "react-router-dom";
import firebase from "firebase";

import stylesUrl from "./styles/global.css";

import { config } from "../firebaseConfig";
import { FirestoreContext } from "./context/firestoreContext";
import { FirebaseAuthContext } from "./context/firebaseAuthContext";
import { useEffect, useState } from "react";
import { getFirebaseApp } from "./firebaseApp";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  const app = useRouteData();
  return (
    <Document>
      <FirestoreContext.Provider value={getFirebaseApp().firestore()}>
        <Outlet />
      </FirestoreContext.Provider>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  );
}