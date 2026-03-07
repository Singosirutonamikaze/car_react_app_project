import React, { useContext } from "react";
import PropTypes from "prop-types";
import UserContext from "../../context/userContext";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";

const DashboardLayout = ({ children, activeMenu }) => {
  useContext(UserContext);

  return (
    <div className="dashboard-layout">
      <Navbar activeMenu={activeMenu} />
      <div className="dashboard-main">
        <div className="max-[1080px]:hidden">
          <Sidebar activeMenu={activeMenu} />
        </div>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeMenu: PropTypes.string,
};

export default DashboardLayout;
