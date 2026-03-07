import React from "react";
import PropTypes from "prop-types";
import { LuDownload, LuRefreshCw } from "react-icons/lu";
import CarInfoCard from "../cards/CarInfoCard";
import EmptyState from "../alerts/EmptyState";

function CarsList({
  cars: inputCars = [],
  onEditCar,
  onDeleteCar,
  onRefresh,
  onDownload,
}) {
  const handleRefresh = () => {
    onRefresh?.();
  };

  const handleDownload = () => {
    onDownload?.();
  };

  let cars = inputCars;
  // Support cars as { success, data, count } or as array
  if (!Array.isArray(cars) && cars && Array.isArray(cars.data)) {
    cars = cars.data;
  }

  return (
    <div className="card rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-cyan-300/15">
        <h4 className="text-lg font-semibold text-slate-100">
          Liste des Voitures ({cars.length})
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-cyan-200 hover:text-cyan-100 hover:bg-cyan-500/15 border border-cyan-300/25 rounded-lg transition-colors"
          >
            <LuRefreshCw className="text-base" />
            <span className="font-medium">Actualiser</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/15 border border-emerald-300/25 rounded-lg transition-colors"
          >
            <LuDownload className="text-base" />
            <span className="font-medium">Télécharger</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        {Array.isArray(cars) && cars.length === 0 ? (
          <EmptyState
            title="Aucune voiture disponible"
            message="Ajoutez une voiture pour alimenter le catalogue."
            compact
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(cars) &&
              cars.map((car) => (
                <CarInfoCard
                  key={car._id}
                  car={car}
                  onEdit={() => onEditCar?.({ ...car, _id: car._id })}
                  onDelete={() => onDeleteCar?.(car)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

CarsList.propTypes = {
  cars: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.shape({ data: PropTypes.arrayOf(PropTypes.object) }),
  ]),
  onEditCar: PropTypes.func,
  onDeleteCar: PropTypes.func,
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func,
};

export default CarsList;
