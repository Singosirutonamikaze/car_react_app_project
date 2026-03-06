import React, { Component } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { FaEdit } from 'react-icons/fa';
import { addThousandSeparator } from '../../../utils/helper';

class SaleInfoCard extends Component {

    statusBadgeClasses = {
        'Payée': 'bg-green-500/20 text-green-300',
        'Confirmée': 'bg-blue-500/20 text-blue-300',
        'En attente': 'bg-yellow-500/20 text-yellow-300',
        'Annulée': 'bg-red-500/20 text-red-300',
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

    render() {
        const { sale, onEdit, onDelete } = this.props;

        return (
            <div className="bg-slate-100/5 rounded-xl border border-slate-100/10 p-4 hover:bg-slate-100/10 transition-colors duration-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1 flex items-center justify-around gap-4">
                        <div className="">
                            <h3 className="text-slate-100 font-semibold text-lg">
                                {sale.voiture?.marque} {sale.voiture?.modelCar}
                            </h3>

                            <p className="text-slate-300 text-sm mt-2">
                                <span className="font-medium">Client:</span> {sale.client?.name} {sale.client?.surname}
                            </p>

                            <p className="text-slate-300 text-sm mt-1">
                                <span className="font-medium">Prix:</span> {addThousandSeparator(sale.prixVente || 0)} FCFA
                            </p>

                            <div className="flex items-center mt-2">
                                <span className="text-slate-300 text-sm font-medium mr-2">Statut:</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${this.getStatusBadgeClass(sale.statut)}`}>
                                    {sale.statut}
                                </span>
                            </div>
                        </div>
                        <div>
                            {sale.numeroTransaction && (
                                <p className="text-slate-400 text-xs mt-2">
                                    <span className="font-medium">Transaction:</span> {sale.numeroTransaction}
                                </p>
                            )}

                            {sale.dateVente && (
                                <p className="text-slate-400 text-xs mt-1">
                                    <span className="font-medium">Date:</span> {this.formatDate(sale.dateVente)}
                                </p>
                            )}

                            {sale.notes && (
                                <p className="text-slate-400 text-xs mt-2 truncate" title={sale.notes}>
                                    <span className="font-medium">Notes:</span> {sale.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={onEdit}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                            title="Modifier la vente"
                        >
                            <FaEdit className="text-lg" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                            title="Supprimer la vente"
                        >
                            <LuTrash2 className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SaleInfoCard;