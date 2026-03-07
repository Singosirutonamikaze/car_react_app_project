import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

import ROUTES from "../../../../../router";
import { PRESENTATION_NAVBAR_DATA } from "../../../../utils/data";

interface NavBarPresentationProps {
  readonly activeItem?: string;
}

function NavBarPresentation({ activeItem }: NavBarPresentationProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-950/45 backdrop-blur-md border-b border-cyan-300/15 text-white z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide text-white">CarHub</h1>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex space-x-6">
            {PRESENTATION_NAVBAR_DATA.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`hover:text-cyan-200 transition-colors duration-200 ${activeItem === item.path ? "text-cyan-200 font-semibold" : "text-white"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="px-4 py-2 rounded-lg border border-cyan-300/40 hover:border-cyan-200 text-cyan-100 hover:text-white transition-colors"
            >
              Se connecter
            </Link>
            <Link
              to={ROUTES.SIGNUP}
              className="px-4 py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-500 text-white transition-colors"
            >
              S'inscrire
            </Link>
          </div>
        </div>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-blue-900/95 px-6 pb-4 pt-2 flex flex-col space-y-3">
          {PRESENTATION_NAVBAR_DATA.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`hover:text-cyan-200 ${activeItem === item.path ? "text-cyan-200 font-semibold" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-2 grid grid-cols-2 gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="text-center px-4 py-2 rounded-lg border border-cyan-300/40 text-cyan-100"
              onClick={() => setOpen(false)}
            >
              Se connecter
            </Link>
            <Link
              to={ROUTES.SIGNUP}
              className="text-center px-4 py-2 rounded-lg bg-cyan-500/90 text-white"
              onClick={() => setOpen(false)}
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
