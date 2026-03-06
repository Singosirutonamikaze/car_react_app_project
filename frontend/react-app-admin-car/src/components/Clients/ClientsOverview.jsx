import React, { useEffect, useState } from 'react';
import CustomLineChart from '../charts/CustomLineChart';

function ClientsChartsLine({ dataClients }) {
    const [chartData, setChartData] = useState([]);

    const prepareClientLineChartData = (data) => {
        if (!data || !Array.isArray(data)) return [];

        // Grouper les clients par jour
        const dailyData = data.reduce((acc, client) => {
            if (client.createdAt) {
                const date = new Date(client.createdAt);
                const dayKey = date.toISOString().slice(0, 10);
                const dayName = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

                if (!acc[dayKey]) {
                    acc[dayKey] = { name: dayName, value: 0 };
                }
                acc[dayKey].value += 1;
            }
            return acc;
        }, {});

        // Trier par date croissante
        return Object.entries(dailyData)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([_, v]) => v);
    };

    useEffect(() => {
        const result = prepareClientLineChartData(dataClients);
        setChartData(result);
    }, [dataClients]);

    return (
        <div className="card bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Évolution des Clients</h3>
                <p className="text-gray-600">Nombre de nouveaux clients par mois</p>
            </div>
            <div className='mt-10'>
                <CustomLineChart data={chartData} />
            </div>
        </div>
    );
}

export default ClientsChartsLine;