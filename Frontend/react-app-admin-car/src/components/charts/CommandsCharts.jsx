import React, { useEffect, useState } from 'react';
import CustomBarChartOrders from './CustomBarChartOrders';
import { LuTrendingUp } from 'react-icons/lu';

function CommandsCharts({ dataCommands }) {
    const [chartData, setChartData] = useState([]);

    const prepareCommandsChartData = (data) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return [];
        }

        const statusData = data.reduce((acc, command) => {
            const status = command?.statut || 'Inconnu';
            if (!acc[status]) {
                acc[status] = 0;
            }
            acc[status] += 1;
            return acc;
        }, {});

        const statusColors = {
            'En attente': '#f59e0b',
            'Confirmée': '#3b82f6',
            'En cours': '#8b5cf6',
            'Livrée': '#10b981',
            'Annulée': '#ef4444',
            'Inconnu': '#6b7280'
        };

        return Object.entries(statusData).map(([name, value]) => ({
            name,
            value,
            color: statusColors[name] || statusColors.Inconnu
        }));
    };

    useEffect(() => {
        const result = prepareCommandsChartData(dataCommands);
        setChartData(result);
    }, [dataCommands]);

    const totalCommands = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-slate-100/5 rounded-xl border border-slate-100/10 backdrop-blur-xl p-6">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-100">
                    Répartition des Commandes par Statut
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                    Analyse de {totalCommands} commandes selon leur statut
                </p>
            </div>

            <div className="mt-6">
                {chartData && chartData.length > 0 ? (
                    <div className="space-y-6">
                        <div className="h-64">
                            <CustomBarChartOrders data={chartData} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {chartData.map((item, index) => (
                                <div key={index} className="bg-slate-100/5 rounded-lg p-4 border border-slate-100/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                        <span className="text-slate-300 text-sm font-medium">{item.name}</span>
                                    </div>
                                    <div className="text-slate-100 text-lg font-bold">{item.value}</div>
                                    <div className="text-slate-400 text-xs">
                                        {totalCommands > 0 ? Math.round((item.value / totalCommands) * 100) : 0}% du total
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/5 rounded-full flex items-center justify-center">
                            <span className="text-2xl text-slate-400"><LuTrendingUp /></span>
                        </div>
                        <p className="text-slate-300 text-lg font-medium">Aucune donnée à afficher</p>
                        <p className="text-slate-400 text-sm mt-1">
                            {!dataCommands || !Array.isArray(dataCommands)
                                ? "Erreur de format des données"
                                : dataCommands.length === 0
                                    ? "Aucune commande enregistrée"
                                    : "Préparation des données en cours..."
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommandsCharts;