import { useState, useEffect } from "react";
import { getAuth } from "../utils/firebase";

export const useAuthenticated = () => {
  const auth = getAuth();

  const [userId, setUserId] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!auth) {
      return () => {};
    }
    return auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : undefined);
    });
  });
  return userId;
};
