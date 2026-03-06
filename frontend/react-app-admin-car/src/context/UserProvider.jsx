import React, { useState } from "react";
import UserContext from "./userContext";

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
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
        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(userData));
        }
    };

    const clearUser = () => {
        setUser(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser
            }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;