import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { LuTrash2, LuMail, LuUser } from 'react-icons/lu';

const ClientInfoCard = ({ client, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getInitials = (name, surname) => {
        const firstInitial = name?.charAt(0)?.toUpperCase() || '';
        const lastInitial = surname?.charAt(0)?.toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
    };

    return (
        <div className="bg-[#14066298] border border-gray-200/50 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
                        {client.profileImageUrl ? (
                            <img
                                src={client.profileImageUrl}
                                alt={`${client.name} ${client.surname}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-violet-600 font-semibold text-sm">
                                {getInitials(client.name, client.surname)}
                            </span>
                        )}
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-800">
                            {client.name} {client.surname}
                        </h5>
                        <p className="text-sm text-gray-500">
                            Ajouté le {formatDate(client.createdAt)}
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

            {/* Informations */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LuMail size={14} />
                    <span>{client.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LuUser size={14} />
                    <span>Client ID: {client._id?.slice(-6) || 'N/A'}</span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Actif
                    </span>
                    <span className="text-xs text-gray-400">
                        {client.ordersCount || 0} commande(s)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ClientInfoCard;