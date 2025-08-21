import {useMemo, useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authUserLoading, setAuthUserLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
    setAuthUserLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

  // Context value accessible everywhere
  const value = useMemo(() => ({
    authUser,
    setAuthUser,
    authUserLoading,
  }), [authUser, authUserLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
