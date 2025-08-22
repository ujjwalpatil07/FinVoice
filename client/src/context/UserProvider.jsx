import { useMemo, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authUserLoading, setAuthUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("authUser"); // we only store ID

        if (!userId) return;

        const { data } = await axios.get("http://localhost:9001/user/get-user", {
          params: { userId }, // ✅ send userId as query param
        });

        if (data?.success) {
          setAuthUser(data?.user);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setAuthUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const markNotificationAsRead = (notificationId) => {
    setAuthUser(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };

  const updateUser = (userData) => {
    setAuthUser(userData);

    if (!userData) {
      localStorage.removeItem("authUser");
    }
  };

  // Context value accessible everywhere
  const value = useMemo(() => ({
    authUser,
    setAuthUser,
    authUserLoading,
    updateUser,
    markNotificationAsRead
  }), [authUser, authUserLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
