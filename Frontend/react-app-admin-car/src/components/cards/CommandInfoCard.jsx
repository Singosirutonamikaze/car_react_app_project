import React, { Component } from 'react';
import { LuTrash2, LuTruck, LuMapPin, LuCalendar } from 'react-icons/lu';
import { FaEdit } from 'react-icons/fa';
import { addThousandSeparator } from '../../../utils/helper';

class CommandInfoCard extends Component {

    statusBadgeClasses = {
        'En attente': 'bg-yellow-500/20 text-yellow-300',
        'Confirmée': 'bg-blue-500/20 text-blue-300',
        'En cours': 'bg-purple-500/20 text-purple-300',
        'Livrée': 'bg-green-500/20 text-green-300',
        'Annulée': 'bg-red-500/20 text-red-300',
        'default': 'bg-gray-500/20 text-gray-300'
    };

    paymentMethodClasses = {
        'Espèces': 'bg-emerald-500/20 text-emerald-300',
        'Virement': 'bg-blue-500/20 text-blue-300',
        'Chèque': 'bg-orange-500/20 text-orange-300',
        'Financement': 'bg-purple-500/20 text-purple-300',
        'default': 'bg-gray-500/20 text-gray-300'
    };

    formatDate = (dateString) => {
        if (!dateString) return 'Date non spécifiée';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    getStatusBadgeClass = (status) => {
        return this.statusBadgeClasses[status] || this.statusBadgeClasses.default;
    };

    getPaymentMethodClass = (method) => {
        return this.paymentMethodClasses[method] || this.paymentMethodClasses.default;
    };

    formatAddress = (address) => {
        if (!address) return 'Adresse non spécifiée';
        return `${address.rue}, ${address.ville} ${address.codePostal}`;
    };

    render() {
        const { command, onEdit, onDelete } = this.props;

        return (
            <div className="bg-slate-100/5 rounded-xl border border-slate-100/10 p-6 hover:bg-slate-100/10 transition-colors duration-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-slate-100 font-semibold text-xl">
                                    {command.voiture?.marque} {command.voiture?.modelCar}
                                </h3>
                                <p className="text-slate-300 text-sm mt-1">
                                    <span className="font-medium">Client:</span> {command.client?.name} {command.client?.surname}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${this.getStatusBadgeClass(command.statut)}`}>
                                    {command.statut}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Montant:</span>
                                    <span className="text-slate-200 font-medium">
                                        {addThousandSeparator(command.montant || 0)} FCFA
                                    </span>
                                </div>
                                
                                {command.fraisLivraison > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm">Frais livraison:</span>
                                        <span className="text-slate-200 font-medium">
                                            {addThousandSeparator(command.fraisLivraison)} FCFA
                                        </span>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between border-t border-slate-700 pt-2">
                                    <span className="text-slate-300 text-sm font-medium">Total:</span>
                                    <span className="text-emerald-400 font-bold text-lg">
                                        {addThousandSeparator(command.montantTotal || command.montant || 0)} FCFA
                                    </span>
                                </div>
                                
                                <div className="mt-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${this.getPaymentMethodClass(command.modePaiement)}`}>
                                        {command.modePaiement}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <LuMapPin className="text-slate-400 text-sm mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium">Adresse de livraison:</p>
                                        <p className="text-slate-200 text-sm">
                                            {this.formatAddress(command.adresseLivraison)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <LuCalendar className="text-slate-400 text-sm mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium">Date commande:</p>
                                        <p className="text-slate-200 text-sm">
                                            {this.formatDate(command.dateCommande)}
                                        </p>
                                    </div>
                                </div>

                                {command.dateLivraisonPrevue && (
                                    <div className="flex items-start gap-2">
                                        <LuTruck className="text-slate-400 text-sm mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-400 text-xs font-medium">Livraison prévue:</p>
                                            <p className="text-slate-200 text-sm">
                                                {this.formatDate(command.dateLivraisonPrevue)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {command.dateLivraisonReelle && (
                                    <div className="flex items-start gap-2">
                                        <LuTruck className="text-green-400 text-sm mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-400 text-xs font-medium">Livré le:</p>
                                            <p className="text-green-300 text-sm font-medium">
                                                {this.formatDate(command.dateLivraisonReelle)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {command.notes && (
                            <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                                <p className="text-slate-400 text-xs font-medium mb-1">Notes:</p>
                                <p className="text-slate-300 text-sm">{command.notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 ml-6">
                        <button
                            onClick={onEdit}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                            title="Modifier la commande"
                        >
                            <FaEdit className="text-lg" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                            title="Supprimer la commande"
                        >
                            <LuTrash2 className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommandInfoCard;