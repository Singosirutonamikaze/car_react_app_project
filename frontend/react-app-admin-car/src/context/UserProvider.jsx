import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import UserContext from "./userContext";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (globalThis.window !== undefined) {
      const storedUser = localStorage.getItem("user");
      try {
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        return null;
      }
    }
    return null;
  });

  const updateUser = (userData) => {
    setUser(userData);
    if (globalThis.window !== undefined) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const clearUser = () => {
    setUser(null);
    if (globalThis.window !== undefined) {
      localStorage.removeItem("user");
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      updateUser,
      clearUser,
    }),
    [user],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
