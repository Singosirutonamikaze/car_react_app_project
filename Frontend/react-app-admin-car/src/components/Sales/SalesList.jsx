import React, { Component } from 'react';
import { LuDownload, LuRefreshCw } from 'react-icons/lu';
import SaleInfoCard from '../cards/SaleInfoCard';

class SalesList extends Component {
    constructor(props) {
        super(props);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleRefresh() {
        console.log('Actualisation de la liste des ventes');
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    }

    handleDownload() {
        console.log('Téléchargement des données ventes');
        if (this.props.onDownload) {
            this.props.onDownload();
        }
    }

    render() {
        const { sales = [], onEditSale, onDeleteSale } = this.props;

        console.log('SalesList - Données reçues:', sales);
        console.log('SalesList - Type des données:', typeof sales);
        console.log('SalesList - Est-ce un tableau?', Array.isArray(sales));

        return (
            <div className="bg-slate-100/5 rounded-xl border border-slate-100/10 backdrop-blur-xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-100/10">
                    <div>
                        <h4 className="text-xl font-semibold text-slate-100">
                            Liste des Ventes ({Array.isArray(sales) ? sales.length : 0})
                        </h4>
                        <p className="text-slate-400 text-sm mt-1">
                            Gestion de toutes les ventes
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={this.handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-colors border border-violet-500/20"
                        >
                            <LuRefreshCw className="text-base" />
                            <span className="font-medium">Actualiser</span>
                        </button>
                        <button
                            onClick={this.handleDownload}
                            className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/20"
                        >
                            <LuDownload className="text-base" />
                            <span className="font-medium">Télécharger</span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {!Array.isArray(sales) || sales.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/5 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-slate-400">📊</span>
                            </div>
                            <p className="text-slate-300 text-lg font-medium">Aucune vente trouvée</p>
                            <p className="text-slate-400 text-sm mt-1">
                                {!Array.isArray(sales)
                                    ? "Erreur de format des données"
                                    : "Commencez par ajouter votre première vente"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {sales.map((sale, index) => {
                                console.log(`Vente ${index}:`, sale);

                                return (
                                    <SaleInfoCard
                                        key={sale._id || sale.id || index}
                                        sale={sale}
                                        onEdit={() => {
                                            console.log('Modifier la vente:', sale);
                                            onEditSale && onEditSale(sale);
                                        }}
                                        onDelete={() => {
                                            console.log('Supprimer la vente:', sale);
                                            onDeleteSale && onDeleteSale(sale);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default SalesList;