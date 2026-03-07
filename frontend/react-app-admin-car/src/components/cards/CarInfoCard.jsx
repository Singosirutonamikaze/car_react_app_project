import React from "react";
import PropTypes from "prop-types";
import { FaEdit, FaCar } from "react-icons/fa";
import {
  LuTrash2,
  LuCalendar,
  LuDollarSign,
  LuMapPin,
  LuGauge,
} from "react-icons/lu";
import { resolveImageUrl } from "../../utils/imageUrl";

const CarInfoCard = ({ car, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatPrice = (price) => {
    if (!price) {
      return "N/A";
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatKilometrage = (km) => {
    if (!km && km !== 0) {
      return "N/A";
    }
    return new Intl.NumberFormat("fr-FR").format(km) + " km";
  };

  const getCarInitials = (marque, modelCar) => {
    const marqueInitial = marque?.charAt(0)?.toUpperCase() || "";
    const modelInitial = modelCar?.charAt(0)?.toUpperCase() || "";
    return `${marqueInitial}${modelInitial}`;
  };

  const getStatusColor = (disponible) => {
    return disponible
      ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/30"
      : "bg-rose-400/20 text-rose-200 border border-rose-300/30";
  };

  const carImage = resolveImageUrl(car?.image);

  return (
    <div className="bg-[#05223a]/75 rounded-xl border border-cyan-300/20 p-4 hover:bg-[#07304f]/80 transition-colors duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-cyan-100/15 border border-cyan-300/30 flex items-center justify-center overflow-hidden">
            {carImage ? (
              <img
                src={carImage}
                alt={`${car.marque} ${car.modelCar}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-cyan-100 font-semibold text-sm">
                {getCarInitials(car.marque, car.modelCar)}
              </span>
            )}
          </div>
          <div>
            <h5 className="font-semibold text-slate-100">
              {car.marque} {car.modelCar}
            </h5>
            <p className="text-sm text-slate-400">
              Ajoutée le {formatDate(car.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-cyan-200 hover:text-cyan-100 hover:bg-cyan-500/15 border border-cyan-300/20 rounded-lg transition-colors"
            title="Modifier"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-rose-200 hover:text-rose-100 hover:bg-rose-500/15 border border-rose-300/25 rounded-lg transition-colors"
            title="Supprimer"
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <LuCalendar size={14} />
          <span>Année: {car.year}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <LuDollarSign size={14} />
          <span>{formatPrice(car.price)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <LuMapPin size={14} />
          <span>{car.ville}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <LuGauge size={14} />
          <span>{formatKilometrage(car.kilometrage)}</span>
        </div>
      </div>

      <div className="bg-[#041b2e]/65 border border-cyan-300/15 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
          <div>
            <span className="font-medium text-cyan-100">Couleur:</span>
            <br />
            <span>{car.couleur}</span>
          </div>
          <div>
            <span className="font-medium text-cyan-100">Carburant:</span>
            <br />
            <span>{car.carburant}</span>
          </div>
        </div>
        {car.description && (
          <div className="mt-2 text-xs text-slate-200">
            <span className="font-medium text-cyan-100">Description:</span>
            <p className="mt-1 line-clamp-2">{car.description}</p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-cyan-300/15">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(car.disponible)}`}
          >
            {car.disponible ? "Disponible" : "Non disponible"}
          </span>
          <div className="text-xs text-slate-400">
            <FaCar size={12} className="inline mr-1" />
            ID: {car._id?.slice(-6) || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

CarInfoCard.propTypes = {
  car: PropTypes.shape({
    _id: PropTypes.string,
    marque: PropTypes.string,
    modelCar: PropTypes.string,
    createdAt: PropTypes.string,
    image: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ville: PropTypes.string,
    kilometrage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    couleur: PropTypes.string,
    carburant: PropTypes.string,
    description: PropTypes.string,
    disponible: PropTypes.bool,
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default CarInfoCard;
