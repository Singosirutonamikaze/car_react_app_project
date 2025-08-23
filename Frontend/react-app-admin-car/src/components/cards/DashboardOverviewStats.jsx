import React, { Component } from 'react';
import CustomPieChart from '../charts/CustomPieChart';

const COLORS = ['#875CF5', '#FA2C37', '#FF6900'];

class DashboardOverviewStats extends Component {
    render() {
        const { totalClients, totalCars, totalOrders, totalSales } = this.props;

        const data = [
            { name: 'Clients', value: totalClients },
            { name: 'Voitures', value: totalCars },
            { name: 'Commandes', value: totalOrders },
            { name: 'Ventes', value: totalSales },
        ];

        return (
            <div className='card'>
                <div className='flex items-center justify-between'>
                    <h5 className='text-lg font-bold'>Vue des Activités</h5>
                </div>
                <CustomPieChart
                    data={data}
                    label='Répartition des Activités'
                    totalAmount={`${totalClients + totalCars + totalOrders + totalSales}`}
                    colors={COLORS}
                    showTextAnchor
                />
            </div>
        )
    }
}

export default DashboardOverviewStats;
