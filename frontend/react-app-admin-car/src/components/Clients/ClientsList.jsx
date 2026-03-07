import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  LuCheckCheck,
  LuChevronLeft,
  LuChevronRight,
  LuDownload,
  LuRefreshCw,
  LuTrash2,
} from "react-icons/lu";
import ClientInfoCard from "../cards/ClientInfoCard";
import EmptyState from "../alerts/EmptyState";

const PAGE_SIZE = 9;

function ClientsList({
  clients = [],
  onEditClient,
  onDeleteClient,
  onRefresh,
  onDownload,
  onBulkDeleteSelected,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const safeClients = useMemo(
    () => (Array.isArray(clients) ? clients : []),
    [clients],
  );
  const safeClientIds = useMemo(
    () => new Set(safeClients.map((client) => client?._id).filter(Boolean)),
    [safeClients],
  );
  const totalPages = Math.max(1, Math.ceil(safeClients.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => safeClientIds.has(id)));
  }, [safeClientIds]);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return safeClients.slice(start, start + PAGE_SIZE);
  }, [safeClients, currentPage]);

  const selectedCount = selectedIds.length;
  const currentPageIds = paginatedClients
    .map((client) => client?._id)
    .filter(Boolean);
  const isCurrentPageFullySelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  const handleRefresh = () => {
    onRefresh?.();
  };

  const handleDownload = () => {
    onDownload?.();
  };

  const toggleSelection = (id) => {
    if (!id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectCurrentPage = () => {
    if (isCurrentPageFullySelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    onBulkDeleteSelected?.(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="card rounded-lg">
      <div className="flex flex-col gap-3 p-4 border-b border-cyan-300/15 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-semibold text-slate-100">
          Liste des Clients ({safeClients.length})
        </h4>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-3 py-2 text-cyan-200 hover:text-cyan-100 hover:bg-cyan-500/15 border border-cyan-300/25 rounded-lg transition-colors sm:px-4"
          >
            <LuRefreshCw className="text-base" />
            <span className="font-medium text-sm sm:text-base">Actualiser</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-3 py-2 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/15 border border-emerald-300/25 rounded-lg transition-colors sm:px-4"
          >
            <LuDownload className="text-base" />
            <span className="font-medium text-sm sm:text-base">
              Télécharger
            </span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {safeClients.length === 0 ? (
          <EmptyState
            title="Aucun client disponible"
            message="Ajoutez un client pour commencer la gestion."
            compact
          />
        ) : (
          <>
            <div className="clients-toolbar">
              <div className="clients-selection-info">
                <LuCheckCheck className="text-sm" />
                <span>{selectedCount} sélectionné(s)</span>
              </div>

              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={toggleSelectCurrentPage}
                  className="flex-1 px-3 py-2 text-xs text-cyan-100 border border-cyan-300/30 hover:bg-cyan-500/12 sm:flex-none"
                >
                  {isCurrentPageFullySelected
                    ? "Désélectionner la page"
                    : "Sélectionner la page"}
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="flex-1 px-3 py-2 text-xs text-slate-200 border border-slate-300/20 hover:bg-slate-500/10 sm:flex-none"
                >
                  Effacer
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={selectedCount === 0}
                  className="inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 text-xs text-rose-200 border border-rose-300/30 hover:bg-rose-500/10 disabled:opacity-50 disabled:cursor-not-allowed sm:flex-none"
                >
                  <LuTrash2 className="text-sm" />
                  Supprimer la sélection
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedClients.map((client) => (
                <div
                  key={client._id}
                  className={`relative rounded-xl ${selectedIds.includes(client._id) ? "ring-2 ring-cyan-300/70" : ""}`}
                >
                  <label className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-md bg-[#042238]/85 px-2 py-1 text-[11px] text-cyan-100 border border-cyan-300/25">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(client._id)}
                      onChange={() => toggleSelection(client._id)}
                      className="h-3.5 w-3.5"
                    />
                    <span>Sélect.</span>
                  </label>

                  <ClientInfoCard
                    client={client}
                    onEdit={() =>
                      onEditClient?.({ ...client, _id: client._id })
                    }
                    onDelete={() => onDeleteClient?.(client)}
                  />
                </div>
              ))}
            </div>

            <div className="clients-pagination flex-wrap">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm text-cyan-100 border border-cyan-300/30 hover:bg-cyan-500/12 disabled:opacity-40"
              >
                <LuChevronLeft /> Précédent
              </button>
              <span className="clients-pagination-text">
                Page {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="inline-flex items-center gap-1 px-3 py-2 text-sm text-cyan-100 border border-cyan-300/30 hover:bg-cyan-500/12 disabled:opacity-40"
              >
                Suivant <LuChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

ClientsList.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.object),
  onEditClient: PropTypes.func,
  onDeleteClient: PropTypes.func,
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func,
  onBulkDeleteSelected: PropTypes.func,
};

export default ClientsList;
