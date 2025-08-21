import { useMemo, useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authUserLoading, setAuthUserLoading] = useState(true);

  useEffect(() => {
    // Simulate user data fetching
    const fetchUserData = async () => {
      try {
        // In a real app, this would be an API call
        const userData = {
          id: 1,
          name: 'Nitin Gayke',
          email: 'nitin@finvoice.com',
          avatar: null,
          bankAccounts: [
            { id: 1, name: 'HDFC Bank', balance: 85420.50, lastDigits: '4589' },
            { id: 2, name: 'SBI Savings', balance: 32450.75, lastDigits: '7632' }
          ],
          notifications: [
            { id: 1, message: 'Your monthly budget for Food is almost exhausted', read: false, timestamp: new Date() },
            { id: 2, message: 'Investment suggestion available for your goals', read: true, timestamp: new Date(Date.now() - 86400000) }
          ]
        };
        setAuthUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setAuthUserLoading(false);
      }
    };

    fetchUserData();
  }, []);


  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

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
