import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomCarChart from "./CustomCarChart";
import EmptyState from "../alerts/EmptyState";

function CarsChartsBar({ dataCars }) {
  const [chartData, setChartData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    avgPrice: 0,
    totalValue: 0,
  });

  const prepareCarBarChartData = (data) => {
    if (!Array.isArray(data)) {
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
    for (let i = 0; i < 24; i += 1) {
      const hourKey = `${i}h`;
      allHours.push({
        name: hourKey,
        value: hourlyData[hourKey] ? hourlyData[hourKey].value : 0,
      });
    }

    return allHours;
  };

  const prepareBrandData = (data) => {
    if (!Array.isArray(data)) return [];

    const brandCounts = data.reduce((acc, car) => {
      const brand = car.marque || "Inconnu";
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(brandCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const prepareFuelData = (data) => {
    if (!Array.isArray(data)) return [];

    const fuelCounts = data.reduce((acc, car) => {
      const fuel = car.carburant || "Inconnu";
      acc[fuel] = (acc[fuel] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(fuelCounts).map(([name, value]) => ({ name, value }));
  };

  const calculateStats = (data) => {
    if (!Array.isArray(data)) {
      return { total: 0, available: 0, avgPrice: 0, totalValue: 0 };
    }

    const total = data.length;
    const available = data.filter((car) => car.disponible !== false).length;
    const totalValue = data.reduce(
      (sum, car) => sum + (Number.parseFloat(car.price) || 0),
      0,
    );
    const avgPrice = total > 0 ? totalValue / total : 0;

    return { total, available, avgPrice, totalValue };
  };

  useEffect(() => {
    if (Array.isArray(dataCars?.data)) {
      const carsArray = dataCars.data;
      setChartData(prepareCarBarChartData(carsArray));
      setBrandData(prepareBrandData(carsArray));
      setFuelData(prepareFuelData(carsArray));
      setStats(calculateStats(carsArray));
      return;
    }

    if (Array.isArray(dataCars)) {
      setChartData(prepareCarBarChartData(dataCars));
      setBrandData(prepareBrandData(dataCars));
      setFuelData(prepareFuelData(dataCars));
      setStats(calculateStats(dataCars));
    }
  }, [dataCars]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="chart-surface rounded-xl p-6 text-white transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">
                Total des Voitures
              </p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="chart-surface rounded-xl p-6 text-white transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-sm font-medium">
                Disponibles
              </p>
              <p className="text-3xl font-bold mt-2">{stats.available}</p>
            </div>
          </div>
        </div>

        <div className="chart-surface rounded-xl p-6 text-white transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Prix Moyen</p>
              <p className="text-2xl font-bold mt-2">
                {formatCurrency(stats.avgPrice)}
              </p>
            </div>
          </div>
        </div>

        <div className="chart-surface rounded-xl p-6 text-white transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Valeur Totale</p>
              <p className="text-xl font-bold mt-2">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-surface rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Ajouts de voitures par heure
            </h3>
            <p className="text-slate-400">
              Distribution horaire des ajouts de véhicules
            </p>
          </div>
          <CustomCarChart data={chartData} />
        </div>

        <div className="chart-surface rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Top 5 des Marques
            </h3>
            <p className="text-slate-400">
              Répartition par marque de véhicules
            </p>
          </div>
          {brandData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#22d3ee"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#07314F",
                    border: "1px solid rgba(103, 232, 249, 0.4)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="Aucune marque disponible"
              message="Le graphique apparaîtra dès qu'une voiture sera enregistrée."
              compact
            />
          )}
        </div>
      </div>

      <div className="chart-surface rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            Répartition par Type de Carburant
          </h3>
          <p className="text-slate-400">Distribution des types d'énergie</p>
        </div>
        {fuelData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={fuelData}>
              <defs>
                <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.12} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#fuelGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            title="Aucun type de carburant"
            message="La répartition s'affichera quand des données seront disponibles."
            compact
          />
        )}
      </div>
    </div>
  );
}

CarsChartsBar.propTypes = {
  dataCars: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object),
    }),
  ]),
};

export default CarsChartsBar;
