import { getAuth } from "../utils/firebase";

export const useSignIn = () => {
  const auth = getAuth();
  if (auth) {
    return () =>
      // @ts-ignore
      auth.signInWithRedirect(new auth.app.firebase_.auth.GoogleAuthProvider());
  }
  return () => {};
};
