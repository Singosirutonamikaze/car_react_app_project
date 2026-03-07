import React from "react";
import PropTypes from "prop-types";
import CustomPieChart from "../charts/CustomPieChart";

const COLORS = ["#0EA5E9", "#10B981", "#F59E0B"];

function DashboardOverviewStats({
  totalClients,
  totalCars,
  totalOrders,
  totalSales,
}) {
  const data = [
    { name: "Clients", value: totalClients },
    { name: "Voitures", value: totalCars },
    { name: "Commandes", value: totalOrders },
    { name: "Ventes", value: totalSales },
  ].map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-bold">Vue des Activités</h5>
      </div>
      <CustomPieChart
        data={data}
        label="Répartition des Activités"
        totalAmount={`${totalClients + totalCars + totalOrders + totalSales}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
}

DashboardOverviewStats.propTypes = {
  totalClients: PropTypes.number,
  totalCars: PropTypes.number,
  totalOrders: PropTypes.number,
  totalSales: PropTypes.number,
};

export default DashboardOverviewStats;
