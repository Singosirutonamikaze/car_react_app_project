import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data";
import CardAvatar from "../cards/CardAvatar";
import Admin from "../../assets/admin.avif";
import { UserAuthentication } from "../../hooks/user/UserAuthentification";
import UserContext from "../../context/userContext";
import { resolveImageUrl } from "../../utils/imageUrl";

const Sidebar = ({ onNavigate, isMobileDrawer = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useContext(UserContext);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(`${route}`);
      onNavigate?.();
    }
  };

  const isMenuActive = (itemPath) => {
    if (!itemPath || itemPath === "logout") {
      return false;
    }

    if (location.pathname === itemPath) {
      return true;
    }

    return location.pathname.startsWith(`${itemPath}/`);
  };

  const handleLogout = () => {
    localStorage.clear();
    if (clearUser) {
      clearUser();
    }
    navigate("/login");
    onNavigate?.();
  };

  const userData = user?.user || user || {};
  const userFullName = userData.name || userData.email || "Administrateur";
  const userProfileImage = resolveImageUrl(userData.profileImageUrl) || Admin;
  const mainMenuItems = SIDE_MENU_DATA.filter(
    (item) => item.label !== "Déconnexion",
  );
  const logoutItem = SIDE_MENU_DATA.find(
    (item) => item.label === "Déconnexion",
  );

  return (
    <UserAuthentication>
      <div
        className={`sidebar-container ${isMobileDrawer ? "sidebar-container-drawer" : ""}`}
        style={{ background: "var(--glass-bg)", color: "var(--text-primary)" }}
      >
        <div className="sidebar-content">
          <div className="user-section">
            <div className="user-profile">
              {userProfileImage ? (
                <img
                  src={userProfileImage}
                  alt="Profile utilisateur"
                  className="user-avatar-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallbackAvatar =
                      document.getElementById("fallbackAvatar");
                    if (fallbackAvatar) {
                      fallbackAvatar.style.display = "flex";
                    }
                  }}
                />
              ) : (
                <CardAvatar
                  id="fallbackAvatar"
                  fullName={userFullName}
                  width="w-16"
                  height="h-16"
                  style="text-base"
                />
              )}
              <p className="user-name" style={{ color: "var(--text-primary)" }}>
                {userFullName}
              </p>
            </div>
          </div>

          <nav className="menu-nav">
            {mainMenuItems.map((item) => (
              <button
                key={`menu-${item.label}`}
                className={`menu-item ${isMenuActive(item.path) ? "active" : ""}`}
                onClick={() => handleClick(item.path)}
                style={{
                  background: isMenuActive(item.path)
                    ? "var(--accent-violet)"
                    : "transparent",
                  color: isMenuActive(item.path)
                    ? "white"
                    : "var(--text-secondary)",
                }}
              >
                <item.icon className="menu-icon" />
                <span className="menu-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {logoutItem ? (
            <div className="menu-logout-wrapper">
              <button
                className="menu-item menu-item-logout"
                onClick={() => handleClick(logoutItem.path)}
              >
                <logoutItem.icon className="menu-icon" />
                <span className="menu-label">{logoutItem.label}</span>
              </button>
            </div>
          ) : null}
        </div>

        <div
          className="sidebar-overlay"
          style={{ background: "var(--glass-bg)" }}
        ></div>
      </div>
    </UserAuthentication>
  );
};

Sidebar.propTypes = {
  onNavigate: PropTypes.func,
  isMobileDrawer: PropTypes.bool,
};

export default Sidebar;
