import { FiAlertTriangle, FiArrowLeft, FiHome, FiSearch } from "react-icons/fi";

import ROUTES from "../../../router";

function NotFoundPage() {
  const handleGoHome = () => {
    globalThis.location.href = ROUTES.HOME;
  };

  const handleGoBack = () => {
    globalThis.history.back();
  };

  const handleSearch = () => {
    globalThis.location.href = ROUTES.SEARCH;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-900 via-blue-950 to-black overflow-hidden flex items-center justify-center relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
              <FiAlertTriangle className="w-16 h-16 text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>

        <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text mb-4 tracking-tight">
          404
        </h1>

        <div className="mb-10 space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Oups ! Page introuvable</h2>
          <p className="text-lg text-blue-200/80 max-w-2xl mx-auto">
            La page que vous recherchez est introuvable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <button onClick={handleGoHome} className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-700/30 p-6 hover:scale-105 transition-transform duration-300">
            <FiHome className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">Accueil</h4>
          </button>

          <button onClick={handleGoBack} className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-700/30 p-6 hover:scale-105 transition-transform duration-300">
            <FiArrowLeft className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">Precedent</h4>
          </button>

          <button onClick={handleSearch} className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-700/30 p-6 hover:scale-105 transition-transform duration-300">
            <FiSearch className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">Recherche</h4>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
