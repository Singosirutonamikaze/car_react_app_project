import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuBell } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import UserContext from "../../context/userContext";

const Navbar = ({ activeMenu = "Dashboard" }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { user } = useContext(UserContext);
  const location = useLocation();

  const userData = user?.user || user || {};
  const initials = (userData.name || "A")[0].toUpperCase();

  useEffect(() => {
    setOpenSideMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = openSideMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openSideMenu]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-14 w-full items-center gap-3 border-b border-cyan-300/15 px-4 md:px-5"
        style={{ background: "var(--glass-bg)", backdropFilter: "blur(20px)" }}
      >
        <button
          type="button"
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A2A42]/70 border border-cyan-300/20 text-cyan-100 hover:bg-cyan-500/20 hover:border-cyan-300/45 hover:text-cyan-100 transition-colors duration-200"
          onClick={() => setOpenSideMenu((prev) => !prev)}
          aria-label="Ouvrir le menu"
        >
          {openSideMenu ? (
            <HiOutlineX className="text-lg" />
          ) : (
            <HiOutlineMenu className="text-lg" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br from-cyan-500 to-cyan-700 shadow-lg shadow-cyan-900/30">
            <span className="text-xs font-bold text-white">C</span>
          </div>
          <h2 className="max-w-28 truncate bg-linear-to-r from-cyan-100 via-slate-100 to-cyan-300 bg-clip-text text-sm font-semibold text-transparent sm:max-w-none md:text-base">
            CarsHub
          </h2>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/20 bg-[#0A2A42]/65 text-cyan-200 hover:bg-cyan-500/18 hover:text-cyan-50 transition-all duration-200"
            aria-label="Notifications"
          >
            <LuBell className="text-base" />
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-600 to-cyan-800 text-xs font-semibold text-white shadow-lg shadow-cyan-950/40 cursor-default">
            {initials}
          </div>
        </div>
      </header>

      {openSideMenu && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpenSideMenu(false)}
            aria-label="Fermer le menu"
          />

          <aside className="fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-[85vw] max-w-72 overflow-hidden rounded-r-2xl border-r border-cyan-300/20 bg-[#052740]/94 shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden">
            <SideBar
              activeMenu={activeMenu}
              isMobileDrawer
              onNavigate={() => setOpenSideMenu(false)}
            />
          </aside>
        </>
      )}
    </>
  );
};

Navbar.propTypes = {
  activeMenu: PropTypes.string,
};

export default Navbar;
