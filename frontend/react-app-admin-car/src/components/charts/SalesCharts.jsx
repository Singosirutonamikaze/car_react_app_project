import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomBarChartSales from "./CustomBarChartSales";
import EmptyState from "../alerts/EmptyState";

function SalesCharts({ dataSales }) {
  const [chartData, setChartData] = useState([]);

  const prepareSalesChartData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const statusData = data.reduce((acc, sale) => {
      const status = sale?.statut || "Inconnu";

      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status] += 1;
      return acc;
    }, {});

    const result = Object.entries(statusData).map(([name, value]) => ({
      name,
      value,
    }));
    return result;
  };

  useEffect(() => {
    const result = prepareSalesChartData(dataSales);
    setChartData(result);
  }, [dataSales]);

  return (
    <div className="chart-surface p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-100">
          Répartition des Ventes par Statut
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          Nombre de ventes selon leur statut
        </p>
      </div>

      <div className="mt-6">
        {chartData && chartData.length > 0 ? (
          <div>
            <CustomBarChartSales data={chartData} />
          </div>
        ) : (
          <EmptyState
            title="Aucune donnée à afficher"
            message={
              Array.isArray(dataSales)
                ? "Aucune vente enregistrée"
                : "Format des données inattendu"
            }
          />
        )}
      </div>
    </div>
  );
}

export default SalesCharts;

SalesCharts.propTypes = {
  dataSales: PropTypes.array,
};
