import React, { useEffect, useState } from 'react';
import CustomBarChartSales from './CustomBarChartSales';
import { LuAArrowUp } from 'react-icons/lu';

function SalesCharts({ dataSales }) {
    const [chartData, setChartData] = useState([]);
    const [debugInfo, setDebugInfo] = useState('');

    const prepareSalesChartData = (data) => {
        console.log('=== DEBUGGING SALES CHARTS ===');
        console.log('SalesCharts - dataSales reçu:', data);
        console.log('SalesCharts - Type:', typeof data);
        console.log('SalesCharts - Est un tableau?', Array.isArray(data));
        console.log('SalesCharts - Valeur truthy?', !!data);

        let debugMsg = `Type: ${typeof data}, Array: ${Array.isArray(data)}, Length: ${data?.length || 'N/A'}`;

        if (!data) {
            console.log('SalesCharts - data est null/undefined');
            setDebugInfo(`${debugMsg} - Data null/undefined`);
            return [];
        }

        if (!Array.isArray(data)) {
            console.log('SalesCharts - data n\'est pas un tableau');
            setDebugInfo(`${debugMsg} - Not an array`);
            return [];
        }

        if (data.length === 0) {
            console.log('SalesCharts - tableau vide');
            setDebugInfo(`${debugMsg} - Empty array`);
            return [];
        }

        console.log('SalesCharts - Première vente:', data[0]);

        const statusData = data.reduce((acc, sale, index) => {
            console.log(`Vente ${index}:`, sale);

            const status = sale?.statut || 'Inconnu';
            console.log(`  - Statut: ${status}`);

            if (!acc[status]) {
                acc[status] = 0;
            }
            acc[status] += 1;
            return acc;
        }, {});

        console.log('SalesCharts - Données groupées par statut:', statusData);

        const result = Object.entries(statusData).map(([name, value]) => ({
            name,
            value
        }));

        console.log('SalesCharts - Données formatées pour le graphique:', result);
        setDebugInfo(`${debugMsg} - Success: ${result.length} statuts`);
        return result;
    };

    useEffect(() => {
        console.log('SalesCharts - useEffect déclenché');
        console.log('SalesCharts - dataSales dans useEffect:', dataSales);

        const result = prepareSalesChartData(dataSales);
        setChartData(result);
    }, [dataSales]);

    console.log('SalesCharts - Render avec chartData:', chartData);

    return (
        <div className="bg-slate-100/5 rounded-xl border border-slate-100/10 backdrop-blur-xl p-6">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-100">
                    Répartition des Ventes par Statut
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                    Nombre de ventes selon leur statut
                </p>

                <div className="mt-2 p-2 bg-slate-800/50 rounded text-xs text-slate-300 font-mono">
                    Debug: {debugInfo}
                </div>
            </div>

            <div className="mt-6">
                {chartData && chartData.length > 0 ? (
                    <div>
                        <CustomBarChartSales data={chartData} />

                        <div className="mt-4 p-3 bg-slate-800/30 rounded">
                            <p className="text-slate-300 text-sm font-medium mb-2">Données du graphique:</p>
                            {chartData.map((item, index) => (
                                <div key={index} className="text-slate-400 text-xs">
                                    {item.name}: {item.value} ventes
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100/5 rounded-full flex items-center justify-center">
                            <span className="text-2xl text-slate-400"><LuAArrowUp /></span>
                        </div>
                        <p className="text-slate-300 text-lg font-medium">Aucune donnée à afficher</p>
                        <p className="text-slate-400 text-sm mt-1">
                            Debug: {debugInfo || 'En attente des données...'}
                        </p>

                        <div className="mt-4 p-3 bg-slate-800/30 rounded text-left">
                            <p className="text-slate-300 text-sm font-medium mb-2">Données brutes reçues:</p>
                            <pre className="text-slate-400 text-xs overflow-x-auto">
                                {JSON.stringify(dataSales, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SalesCharts;