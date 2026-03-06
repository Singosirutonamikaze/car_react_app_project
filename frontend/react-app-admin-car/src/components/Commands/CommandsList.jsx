import React, { Component } from 'react';
import { LuDownload, LuRefreshCw } from 'react-icons/lu';
import CommandInfoCard from '../cards/CommandInfoCard';

class CommandsList extends Component {
    constructor(props) {
        super(props);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleRefresh() {
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    }

    handleDownload() {
        if (this.props.onDownload) {
            this.props.onDownload();
        }
    }

    getStatusStats(commands) {
        if (!Array.isArray(commands)){
            return {};
        }

        return commands.reduce((acc, command) => {
            const status = command?.statut || 'Inconnu';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    }

    getTotalRevenue(commands) {
        if (!Array.isArray(commands)) return 0;

        return commands.reduce((total, command) => {
            return total + (command?.montantTotal || command?.montant || 0);
        }, 0);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' FCFA';
    }

    render() {
        const { commands = [], onEditCommand, onDeleteCommand } = this.props;

        const isValidArray = Array.isArray(commands);
        const commandsCount = isValidArray ? commands.length : 0;
        const statusStats = this.getStatusStats(commands);
        const totalRevenue = this.getTotalRevenue(commands);

        return (
            <div className="bg-slate-100/5 rounded-xl border border-slate-100/10 backdrop-blur-xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-100/10">
                    <div>
                        <h4 className="text-xl font-semibold text-slate-100">
                            Liste des Commandes ({commandsCount})
                        </h4>
                        <p className="text-slate-400 text-sm mt-1">
                            Gestion de toutes les commandes
                        </p>

                        {commandsCount > 0 && (
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-emerald-400 text-sm font-medium">
                                    Total: {this.formatCurrency(totalRevenue)}
                                </span>
                                {Object.entries(statusStats).map(([status, count]) => (
                                    <span key={status} className="text-slate-300 text-xs">
                                        {status}: {count}
                                    </span>
                                ))}
                            </div>
                        )}
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
                    {!isValidArray ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-red-400">⚠️</span>
                            </div>
                            <p className="text-red-300 text-lg font-medium">Erreur de format des données</p>
                            <p className="text-slate-400 text-sm mt-1">
                                Les données reçues ne sont pas valides
                            </p>
                        </div>
                    ) : commandsCount === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/5 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-slate-400">📋</span>
                            </div>
                            <p className="text-slate-300 text-lg font-medium">Aucune commande trouvée</p>
                            <p className="text-slate-400 text-sm mt-1">
                                Commencez par ajouter votre première commande
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {commands.map((command, index) => (
                                    <CommandInfoCard
                                        key={command._id || command.id || `command-${index}`}
                                        command={command}
                                        onEdit={() => onEditCommand && onEditCommand(command)}
                                        onDelete={() => onDeleteCommand && onDeleteCommand(command)}
                                    />
                                ))}
                            </div>

                            {commandsCount > 20 && (
                                <div className="flex justify-center mt-6">
                                    <div className="bg-slate-100/5 rounded-lg px-4 py-2 border border-slate-100/10">
                                        <span className="text-slate-300 text-sm">
                                            Affichage de {commandsCount} commandes
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default CommandsList;