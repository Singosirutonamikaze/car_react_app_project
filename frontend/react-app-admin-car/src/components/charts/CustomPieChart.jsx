import PropTypes from "prop-types";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend } from "recharts";
import CustomLegend from "./CustomLegend";
import CustomTooltip from "./CustomTooltip";
import EmptyState from "../alerts/EmptyState";

function CustomPieChart({ data, label, totalAmount, colors, showTextAnchor }) {
  if (!Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          title="Aucune donnée disponible"
          message="Le graphique sera visible dès que les données seront valides."
          compact
        />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
          fill={
            Array.isArray(colors) && colors.length > 0 ? colors[0] : "#22d3ee"
          }
        />
        <Tooltip content={CustomTooltip} />
        <Legend content={CustomLegend} />

        {showTextAnchor && (
          <>
            <text
              x="50%"
              y="50%"
              dy={-25}
              textAnchor="middle"
              fill="#a5f3fc"
              fontSize="14px"
            >
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={8}
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="24px"
              fontWeight="semi-bold"
            >
              {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}

CustomPieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colors: PropTypes.arrayOf(PropTypes.string),
  showTextAnchor: PropTypes.bool,
};

export default CustomPieChart;
