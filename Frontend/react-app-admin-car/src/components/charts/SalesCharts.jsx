import React, { useEffect, useState } from 'react';import CustomBarChart from './CustomBarChart';
;

function SalesCharts({ dataSales }) {
    const [chartData, setChartData] = useState([]);

    const prepareSalesChartData = (data) => {
        if (!data || !Array.isArray(data)) return [];

        // Grouper les ventes par statut
        const statusData = data.reduce((acc, sale) => {
            const status = sale.statut || 'Inconnu';
            if (!acc[status]) {
                acc[status] = 0;
            }
            acc[status] += 1;
            return acc;
        }, {});

        // Convertir en format pour le graphique
        return Object.entries(statusData).map(([name, value]) => ({
            name,
            value
        }));
    };

    useEffect(() => {
        const result = prepareSalesChartData(dataSales);
        setChartData(result);
    }, [dataSales]);

    return (
        <div className="card bg-white rounded-lg shadow-md p-4">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Répartition des Ventes par Statut</h3>
                <p className="text-gray-600">Nombre de ventes selon leur statut</p>
            </div>
            <div className='mt-6'>
                <CustomBarChart data={chartData} />
            </div>
        </div>
    );
}

export default SalesCharts;