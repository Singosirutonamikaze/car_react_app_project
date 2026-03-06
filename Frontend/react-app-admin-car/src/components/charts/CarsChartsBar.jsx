import React, { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import CustomCarChart from './CustomCarChart';

function CarsChartsBar({ dataCars }) {
        const [chartData, setChartData] = useState([]);
        const [brandData, setBrandData] = useState([]);
        const [fuelData, setFuelData] = useState([]);
        const [stats, setStats] = useState({
            total: 0,
            available: 0,
            avgPrice: 0,
            totalValue: 0
        });

        const COLORS = ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#EDE9FE'];

        const prepareCarBarChartData = (data) => {
            if (!data || !Array.isArray(data)) {
                return [];
            }

            const hourlyData = data.reduce((acc, car) => {
                if (car.createdAt) {
                    const date = new Date(car.createdAt);
                    const hour = date.getHours();
                    const hourKey = `${hour}h`;
                    if (!acc[hourKey]) {
                        acc[hourKey] = { name: hourKey, value: 0 };
                    }
                    acc[hourKey].value += 1;
                }
                return acc;
            }, {});

            const allHours = [];
            for (let i = 0; i < 24; i++) {
                const hourKey = `${i}h`;
                allHours.push({
                    name: hourKey,
                    value: hourlyData[hourKey] ? hourlyData[hourKey].value : 0
                });
            }
            return allHours;
        };

        const prepareBrandData = (data) => {
            if (!data || !Array.isArray(data)) return [];

            const brandCounts = data.reduce((acc, car) => {
                const brand = car.marque || 'Inconnu';
                acc[brand] = (acc[brand] || 0) + 1;
                return acc;
            }, {});

            return Object.entries(brandCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5);
        };

        const prepareFuelData = (data) => {
            if (!data || !Array.isArray(data)) return [];

            const fuelCounts = data.reduce((acc, car) => {
                const fuel = car.carburant || 'Inconnu';
                acc[fuel] = (acc[fuel] || 0) + 1;
                return acc;
            }, {});

            return Object.entries(fuelCounts)
                .map(([name, value]) => ({ name, value }));
        };

        const calculateStats = (data) => {
            if (!data || !Array.isArray(data)) {
                return { total: 0, available: 0, avgPrice: 0, totalValue: 0 };
            }

            const total = data.length;
            const available = data.filter(car => car.disponible !== false).length;
            const totalValue = data.reduce((sum, car) => sum + (parseFloat(car.price) || 0), 0);
            const avgPrice = total > 0 ? totalValue / total : 0;

            return { total, available, avgPrice, totalValue };
        };

        useEffect(() => {
            if (dataCars?.data && Array.isArray(dataCars.data)) {
                const carsArray = dataCars.data;
                setChartData(prepareCarBarChartData(carsArray));
                setBrandData(prepareBrandData(carsArray));
                setFuelData(prepareFuelData(carsArray));
                setStats(calculateStats(carsArray));
            } else if (Array.isArray(dataCars)) {
                setChartData(prepareCarBarChartData(dataCars));
                setBrandData(prepareBrandData(dataCars));
                setFuelData(prepareFuelData(dataCars));
                setStats(calculateStats(dataCars));
            }
        }, [dataCars]);

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        };

        return (
            <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-violet-100 text-sm font-medium">Total des Voitures</p>
                                <p className="text-3xl font-bold mt-2">{stats.total}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.85,7H17.15L18.4,10H5.6L6.85,7M19,17H5V12H19V17M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium">Disponibles</p>
                                <p className="text-3xl font-bold mt-2">{stats.available}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-medium">Prix Moyen</p>
                                <p className="text-2xl font-bold mt-2">{formatCurrency(stats.avgPrice)}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pink-100 text-sm font-medium">Valeur Totale</p>
                                <p className="text-xl font-bold mt-2">{formatCurrency(stats.totalValue)}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-xl p-6 border border-slate-700/50">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Ajouts de Voitures par Heure</h3>
                            <p className="text-slate-400">Distribution horaire des ajouts de véhicules</p>
                        </div>
                        <CustomCarChart data={chartData} />
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-xl p-6 border border-slate-700/50">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Top 5 des Marques</h3>
                            <p className="text-slate-400">Répartition par marque de véhicules</p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={brandData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {brandData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                        color: '#f1f5f9'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-xl p-6 border border-slate-700/50">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">Répartition par Type de Carburant</h3>
                        <p className="text-slate-400">Distribution des types d'énergie</p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={fuelData}>
                            <defs>
                                <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#f1f5f9'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                fill="url(#fuelGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

export default CarsChartsBar;