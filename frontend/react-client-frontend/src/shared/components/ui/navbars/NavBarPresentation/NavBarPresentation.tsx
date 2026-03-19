import { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import ROUTES from "../../../../../router";
import { PRESENTATION_NAVBAR_DATA } from "../../../../utils/data";

interface NavBarPresentationProps {
  readonly activeItem?: string;
}

function NavBarPresentation({ activeItem }: NavBarPresentationProps) {
  const [open, setOpen] = useState(false);
  const [showAuthActions, setShowAuthActions] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full client-theme-nav-shell backdrop-blur-md border-b z-50">
      <div className="max-w-8xl mx-auto flex items-center px-6 py-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-wide client-theme-text-primary">CarHub</h1>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center relative">
          <nav className="flex items-center space-x-6">
            {PRESENTATION_NAVBAR_DATA.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`client-theme-nav-link-presentation client-theme-nav-link-box text-sm border rounded-full px-3 py-1 transition-all duration-200 ${activeItem === item.path
                  ? "client-theme-nav-link-presentation-active client-theme-nav-link-box-active"
                  : "hover:text-[0.82rem]"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute right-0">
            <button
              type="button"
              onClick={() => setShowAuthActions((prev) => !prev)}
              className="p-1 client-theme-text-primary transition-all duration-200 hover:scale-[0.98]"
              title="Compte"
            >
              <FaUserCircle className="text-2xl" />
            </button>

            <div
              className={`absolute right-0 mt-2 w-48 client-theme-glass-strong border rounded-lg p-2 flex flex-col gap-2 transition-all duration-200 ${showAuthActions
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
              <Link
                to={ROUTES.LOGIN}
                className="px-3 py-2 rounded-lg border client-theme-outline-button text-sm text-left"
                onClick={() => setShowAuthActions(false)}
              >
                Se connecter
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="px-3 py-2 rounded-lg client-theme-button border text-sm text-left"
                onClick={() => setShowAuthActions(false)}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="md:hidden client-theme-glass-strong px-6 pb-4 pt-2 flex flex-col space-y-3">
          {PRESENTATION_NAVBAR_DATA.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`client-theme-nav-link-presentation client-theme-nav-link-box text-sm border rounded-lg px-3 py-1 transition-all duration-200 ${activeItem === item.path
                ? "client-theme-nav-link-presentation-active client-theme-nav-link-box-active"
                : ""
                }`}
              onClick={() => {
                setOpen(false);
                setShowAuthActions(false);
              }}
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setShowAuthActions((prev) => !prev)}
            className="mt-1 p-1 client-theme-text-primary text-left"
            title="Compte"
          >
            <FaUserCircle className="text-2xl" />
          </button>

          <div
            className={`grid grid-cols-2 gap-3 transition-all duration-200 ${showAuthActions
              ? "max-h-40 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
              }`}
          >
            <Link
              to={ROUTES.LOGIN}
              className="text-center px-4 py-2 rounded-lg border client-theme-outline-button text-sm"
              onClick={() => {
                setOpen(false);
                setShowAuthActions(false);
              }}
            >
              Se connecter
            </Link>
            <Link
              to={ROUTES.SIGNUP}
              className="text-center px-4 py-2 rounded-lg client-theme-button border text-sm"
              onClick={() => {
                setOpen(false);
                setShowAuthActions(false);
              }}
            >
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBarPresentation;
