import { useAuthenticated } from "../hooks/useAuthenticated";
import { useSignIn } from "../hooks/useSignIn";
import { Fragment } from "react";

interface Props {
  children: React.ReactNode;
}

export const Authenticated = ({ children }: Props) => {
  const userId = useAuthenticated();
  const signIn = useSignIn();
  if (!userId) {
    return (
      <div>
        <button>Sign In</button>
      </div>
    );
  }
  return <Fragment>{children}</Fragment>;
};
