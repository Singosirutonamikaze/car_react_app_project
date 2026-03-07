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

  const toNumber = (value) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === "string") {
      const parsed = Number(value.replaceAll(/[\s,]/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  return commands.reduce((total, command) => {
    return total + toNumber(command?.montantTotal ?? command?.montant);
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

function CommandsList(props) {
  const commands = Array.isArray(props.commands) ? props.commands : [];
  const onEditCommand = props.onEditCommand;
  const onDeleteCommand = props.onDeleteCommand;
  const onRefresh = props.onRefresh;
  const onDownload = props.onDownload;

  const handleRefresh = () => {
    if (typeof onRefresh === "function") {
      onRefresh();
    }
  };

  const handleDownload = () => {
    if (typeof onDownload === "function") {
      onDownload();
    }
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
              onEdit={() => {
                if (typeof onEditCommand === "function") {
                  onEditCommand(command);
                }
              }}
              onDelete={() => {
                if (typeof onDeleteCommand === "function") {
                  onDeleteCommand(command);
                }
              }}
            />
          ))}
        </div>

        {commandsCount > 20 && (
          <div className="mt-6 flex justify-center">
            <div className="rounded-lg border border-slate-100/10 bg-slate-100/5 px-4 py-2">
              <span className="text-sm text-slate-300">
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
      <div className="flex flex-col gap-4 border-b border-slate-100/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-100 sm:text-xl">
            Liste des Commandes ({commandsCount})
          </h4>
          <p className="mt-1 text-sm text-slate-400">
            Gestion de toutes les commandes
          </p>

          {commandsCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium text-emerald-400">
                Total: {formatCurrency(totalRevenue)}
              </span>
              {Object.entries(statusStats).map(([status, count]) => (
                <span key={status} className="text-xs text-slate-300">
                  {status}: {count}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 rounded-lg border border-cyan-300/25 px-3 py-2 text-cyan-200 transition-colors hover:bg-cyan-500/15 hover:text-cyan-100 sm:px-4"
          >
            <LuRefreshCw className="text-base" />
            <span className="text-sm font-medium sm:text-base">Actualiser</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 px-3 py-2 text-emerald-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-300 sm:px-4"
          >
            <LuDownload className="text-base" />
            <span className="text-sm font-medium sm:text-base">
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
