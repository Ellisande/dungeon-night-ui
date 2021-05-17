import { useEffect } from "react";
import { signOut, getAuth } from "firebase/auth";

export const useSignOut = () => {
  const auth = getAuth();

  return useEffect(() => {
    if (!auth) {
      return () => {};
    }
    signOut(auth);
  }, [auth]);
};
