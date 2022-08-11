import { signInWithRedirect, GoogleAuthProvider, getAuth } from "firebase/auth";

export const useSignIn = () => {
  const provider = new GoogleAuthProvider();
  if (signInWithRedirect) {
    return () =>
      // @ts-ignore
      signInWithRedirect(getAuth(), provider);
  }
  return () => {};
};
