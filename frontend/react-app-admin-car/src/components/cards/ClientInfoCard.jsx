import React from "react";
import PropTypes from "prop-types";
import { FaEdit } from "react-icons/fa";
import { LuTrash2, LuMail, LuUser } from "react-icons/lu";
import { resolveImageUrl } from "../../utils/imageUrl";

const ClientInfoCard = ({ client, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getInitials = (name, surname) => {
    const firstInitial = name?.charAt(0)?.toUpperCase() || "";
    const lastInitial = surname?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  const clientImage = resolveImageUrl(client?.profileImageUrl);

  return (
    <div className="bg-[#05223a]/75 rounded-xl border border-cyan-300/20 p-4 hover:bg-[#07304f]/80 transition-colors duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-cyan-100/15 border border-cyan-300/30 flex items-center justify-center overflow-hidden">
            {clientImage ? (
              <img
                src={clientImage}
                alt={`${client.name} ${client.surname}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-cyan-100 font-semibold text-sm">
                {getInitials(client.name, client.surname)}
              </span>
            )}
          </div>
          <div>
            <h5 className="font-semibold text-slate-100">
              {client.name} {client.surname}
            </h5>
            <p className="text-sm text-slate-400">
              Ajouté le {formatDate(client.createdAt)}
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

      {/* Informations */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <LuMail size={14} />
          <span>{client.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-300">
          <LuUser size={14} />
          <span>Client ID: {client._id?.slice(-6) || "N/A"}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-cyan-300/15">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
            Actif
          </span>
          <span className="text-xs text-slate-400">
            {client.ordersCount || 0} commande(s)
          </span>
        </div>
      </div>
    </div>
  );
};

ClientInfoCard.propTypes = {
  client: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    surname: PropTypes.string,
    createdAt: PropTypes.string,
    profileImageUrl: PropTypes.string,
    email: PropTypes.string,
    ordersCount: PropTypes.number,
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ClientInfoCard;
