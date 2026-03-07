import React from "react";
import PropTypes from "prop-types";
import { LuDownload, LuRefreshCw } from "react-icons/lu";
import SaleInfoCard from "../cards/SaleInfoCard";
import EmptyState from "../alerts/EmptyState";

function SalesList({
  sales = [],
  onEditSale,
  onDeleteSale,
  onRefresh,
  onDownload,
}) {
  const handleRefresh = () => {
    onRefresh?.();
  };

  const handleDownload = () => {
    onDownload?.();
  };

  const isSalesArray = Array.isArray(sales);
  const isEmpty = !isSalesArray || sales.length === 0;
  const emptyMessage = isSalesArray
    ? "Commencez par ajouter votre première vente"
    : "Format de données invalide";

  return (
    <div className="card rounded-xl">
      <div className="flex flex-col gap-4 p-4 border-b border-slate-100/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-100 sm:text-xl">
            Liste des Ventes ({isSalesArray ? sales.length : 0})
          </h4>
          <p className="text-slate-400 text-sm mt-1">
            Gestion de toutes les ventes
          </p>
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

      <div className="p-6">
        {isEmpty ? (
          <EmptyState title="Aucune vente disponible" message={emptyMessage} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {sales.map((sale, index) => {
              return (
                <SaleInfoCard
                  key={
                    sale._id ||
                    sale.id ||
                    `sale-${sale?.numeroTransaction || index}`
                  }
                  sale={sale}
                  onEdit={() => onEditSale?.(sale)}
                  onDelete={() => onDeleteSale?.(sale)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

SalesList.propTypes = {
  sales: PropTypes.arrayOf(PropTypes.object),
  onEditSale: PropTypes.func,
  onDeleteSale: PropTypes.func,
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func,
};

export default SalesList;
