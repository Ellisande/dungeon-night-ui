import { useEffect } from "react";
import { getAuth } from "../utils/firebase";

export const useSignOut = () => {
  const auth = getAuth();
  const user = auth && auth.currentUser;
  return useEffect(() => {
    if (!auth || !user) {
      return () => {};
    }
    auth.signOut();
  }, [auth, user]);
};
