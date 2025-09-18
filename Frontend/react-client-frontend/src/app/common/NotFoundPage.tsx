import { FiHome, FiArrowLeft, FiSearch, FiAlertTriangle } from "react-icons/fi";
import ROUTES from "../../router";

function NotFoundPage() {
  const handleGoHome = () => {
    window.location.href = ROUTES.HOME;
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSearch = () => {
    window.location.href = ROUTES.SEARCH;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-900 via-blue-950 to-black overflow-hidden flex items-center justify-center relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>

        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            style={{
              backgroundImage: `
                   linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                 `,
              backgroundSize: '50px 50px'
            }}>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
              <FiAlertTriangle className="w-16 h-16 text-blue-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 w-32 h-32 bg-blue-500/10 rounded-full animate-ping"></div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text mb-4 tracking-tight">
            404
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="mb-12 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Oups ! Page introuvable
          </h2>
          <p className="text-lg text-blue-200/80 max-w-2xl mx-auto leading-relaxed">
            La page que vous recherchez semble avoir pris la route sans laisser d'adresse.
            Peut-être s'est-elle perdue dans le garage numérique ?
          </p>
          <p className="text-sm text-blue-300/60">
            Code d'erreur : 404 - Ressource non trouvée
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-xl text-white mb-6">Que souhaitez-vous faire ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <button onClick={handleGoHome} className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-700/30 p-6 hover:scale-105 transition-transform duration-300">
              <FiHome className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="text-white font-medium mb-2">Retour à l'accueil</h4>
              <p className="text-slate-400 text-sm">Retournez à la page principale de CarHub</p>
            </button>

            <button onClick={handleGoBack} className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-700/30 p-6 hover:scale-105 transition-transform duration-300">
              <FiArrowLeft className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h4 className="text-white font-medium mb-2">Page précédente</h4>
              <p className="text-slate-400 text-sm">Revenez à la dernière page visitée</p>
            </button>

            <button onClick={handleSearch} className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-700/30 p-6 hover:scale-105 transition-transform duration-300">
              <FiSearch className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="text-white font-medium mb-2">Rechercher</h4>
              <p className="text-slate-400 text-sm">Trouvez ce que vous cherchez</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoHome}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-3"
          >
            <FiHome className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Retour à l'accueil</span>
          </button>

          <button
            onClick={handleGoBack}
            className="group px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-medium rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 border border-slate-600/50 hover:border-slate-500/50 flex items-center space-x-3"
          >
            <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Page précédente</span>
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-blue-800/30">
          <div className="flex items-center justify-center space-x-2 text-blue-300/60">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-sm">
              CarHub - Votre plateforme automobile de confiance
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-blue-300/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 right-1/4 w-1.5 h-1.5 bg-cyan-300/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}

export default NotFoundPage;