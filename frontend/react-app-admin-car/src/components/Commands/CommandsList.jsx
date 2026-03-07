import React from "react";
import PropTypes from "prop-types";
import { LuDownload, LuRefreshCw } from "react-icons/lu";
import CommandInfoCard from "../cards/CommandInfoCard";
import EmptyState from "../alerts/EmptyState";

function getStatusStats(commands) {
  if (!Array.isArray(commands)) {
    return {};
  }

  return commands.reduce((acc, command) => {
    const status = command?.statut || "Inconnu";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

function getTotalRevenue(commands) {
  if (!Array.isArray(commands)) return 0;

  return commands.reduce((total, command) => {
    return total + (command?.montantTotal || command?.montant || 0);
  }, 0);
}

function formatCurrency(amount) {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA"
  );
}

function CommandsList({
  commands = [],
  onEditCommand,
  onDeleteCommand,
  onRefresh,
  onDownload,
}) {
  const handleRefresh = () => {
    onRefresh?.();
  };

  const handleDownload = () => {
    onDownload?.();
  };

  const isValidArray = Array.isArray(commands);
  const commandsCount = isValidArray ? commands.length : 0;
  const statusStats = getStatusStats(commands);
  const totalRevenue = getTotalRevenue(commands);

  let content = null;

  if (!isValidArray) {
    content = (
      <EmptyState
        title="Format de données invalide"
        message="Les données reçues ne sont pas valides."
      />
    );
  } else if (commandsCount === 0) {
    content = (
      <EmptyState
        title="Aucune commande disponible"
        message="Commencez par ajouter votre première commande."
      />
    );
  } else {
    content = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {commands.map((command, index) => (
            <CommandInfoCard
              key={command._id || command.id || `command-${index}`}
              command={command}
              onEdit={() => onEditCommand?.(command)}
              onDelete={() => onDeleteCommand?.(command)}
            />
          ))}
        </div>

        {commandsCount > 20 && (
          <div className="flex justify-center mt-6">
            <div className="bg-slate-100/5 rounded-lg px-4 py-2 border border-slate-100/10">
              <span className="text-slate-300 text-sm">
                Affichage de {commandsCount} commandes
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card rounded-xl">
      <div className="flex flex-col gap-4 p-4 border-b border-slate-100/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-100 sm:text-xl">
            Liste des Commandes ({commandsCount})
          </h4>
          <p className="text-slate-400 text-sm mt-1">
            Gestion de toutes les commandes
          </p>

          {commandsCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-emerald-400 text-sm font-medium">
                Total: {formatCurrency(totalRevenue)}
              </span>
              {Object.entries(statusStats).map(([status, count]) => (
                <span key={status} className="text-slate-300 text-xs">
                  {status}: {count}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-3 py-2 text-cyan-200 hover:text-cyan-100 hover:bg-cyan-500/15 rounded-lg transition-colors border border-cyan-300/25 sm:px-4"
          >
            <LuRefreshCw className="text-base" />
            <span className="font-medium text-sm sm:text-base">Actualiser</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/20 sm:px-4"
          >
            <LuDownload className="text-base" />
            <span className="font-medium text-sm sm:text-base">
              Télécharger
            </span>
          </button>
        </div>
      </div>

      <div className="p-6">{content}</div>
    </div>
  );
}

CommandsList.propTypes = {
  commands: PropTypes.arrayOf(PropTypes.object),
  onEditCommand: PropTypes.func,
  onDeleteCommand: PropTypes.func,
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func,
};

export default CommandsList;
