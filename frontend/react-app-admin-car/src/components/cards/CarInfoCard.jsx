import React from 'react';
import { FaEdit, FaCar } from 'react-icons/fa';
import { LuTrash2, LuCalendar, LuDollarSign, LuMapPin, LuGauge } from 'react-icons/lu';

const CarInfoCard = ({ car, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) {
            return 'N/A';
        }
        return (
            new Date(dateString).toLocaleDateString('fr-FR')
        );
    };

    const formatPrice = (price) => {
        if (!price) {
            return 'N/A';
        }
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatKilometrage = (km) => {
        if (!km && km !== 0) {
            return 'N/A';
        }
        return (
            new Intl.NumberFormat('fr-FR').format(km) + ' km'
        );
    };

    const getCarInitials = (marque, modelCar) => {
        const marqueInitial = marque?.charAt(0)?.toUpperCase() || '';
        const modelInitial = modelCar?.charAt(0)?.toUpperCase() || '';
        return (
            `${marqueInitial}${modelInitial}`
        );
    };

    const getStatusColor = (disponible) => {
        return (
            disponible
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
        );
    };

    return (
            <div className="bg-slate-100/5 rounded-xl border border-slate-100/10 p-4 hover:bg-slate-100/10 transition-colors duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
                        {car.image ? (
                            <img
                                src={car.image}
                                alt={`${car.marque} ${car.modelCar}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-violet-600 font-semibold text-sm">
                                {getCarInitials(car.marque, car.modelCar)}
                            </span>
                        )}
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-800">
                            {car.marque} {car.modelCar}
                        </h5>
                        <p className="text-sm text-gray-500">
                            Ajoutée le {formatDate(car.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                    <button
                        onClick={onEdit}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                    >
                        <FaEdit size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                    >
                        <LuTrash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LuCalendar size={14} />
                    <span>Année: {car.year}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LuDollarSign size={14} />
                    <span>{formatPrice(car.price)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LuMapPin size={14} />
                    <span>{car.ville}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LuGauge size={14} />
                    <span>{formatKilometrage(car.kilometrage)}</span>
                </div>
            </div>

            <div className="bg-gray-50/15 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-50">
                    <div>
                        <span className="font-medium">Couleur:</span>
                        <br />
                        <span>{car.couleur}</span>
                    </div>
                    <div>
                        <span className="font-medium">Carburant:</span>
                        <br />
                        <span>{car.carburant}</span>
                    </div>
                </div>
                {car.description && (
                    <div className="mt-2 text-xs text-gray-50">
                        <span className="font-medium">Description:</span>
                        <p className="mt-1 line-clamp-2">{car.description}</p>
                    </div>
                )}
            </div>

            <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(car.disponible)}`}>
                        {car.disponible ? 'Disponible' : 'Non disponible'}
                    </span>
                    <div className="text-xs text-gray-400">
                        <FaCar size={12} className="inline mr-1" />
                        ID: {car._id?.slice(-6) || 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarInfoCard;
