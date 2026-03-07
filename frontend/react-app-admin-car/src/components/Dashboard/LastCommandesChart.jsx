import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { prepareCommandeBarChartData } from "../../utils/helper";
import CustomBarChart from "../charts/CustomBarChart";
import EmptyState from "../alerts/EmptyState";

function LastCommandesChart({ data }) {
  const chartData = useMemo(() => {
    const transactionsData = data?.transactions || data || [];
    return prepareCommandeBarChartData(transactionsData);
  }, [data]);

  return (
    <div className="card col-md-6">
      <div className="card-header">
        <h5 className="card-title mb-6">
          Dernières commandes des 30 derniers jours
        </h5>
      </div>
      <div className="card-body">
        {chartData.length > 0 ? (
          <CustomBarChart data={chartData} />
        ) : (
          <EmptyState
            title="Aucune donnee disponible"
            message="Les dernieres commandes apparaitront ici."
            compact
          />
        )}
      </div>
    </div>
  );
}

LastCommandesChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.shape({
      transactions: PropTypes.arrayOf(PropTypes.object),
    }),
  ]),
};

export default LastCommandesChart;
