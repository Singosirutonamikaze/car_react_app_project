import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "../alerts/EmptyState";

const ChartTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-cyan-300/30 bg-[#07314F]/95 p-2 shadow-md">
        <p className="mb-1 text-xs font-semibold text-cyan-100">
          {payload[0].payload.client || payload[0].payload.month}
        </p>
        <p className="text-sm text-slate-200">
          :{" "}
          <span className="text-sm font-medium text-white">
            {payload[0].payload.amount}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

function CustomBarChart({ data: rawData }) {
  const data = Array.isArray(rawData) ? rawData : [];
  const xAxisKey = data.length && data[0].client ? "client" : "month";

  return (
    <div className="mt-6 rounded-lg border border-cyan-300/15 bg-[#07314F]/55 p-3">
      {data.length === 0 ? (
        <EmptyState
          title="Aucune commande à afficher"
          message="Les données du graphique apparaîtront ici."
          compact
        />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid stroke="none" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: "#cbd5e1" }}
              stroke="none"
            />
            <YAxis tick={{ fontSize: 12, fill: "#cbd5e1" }} stroke="none" />
            <Tooltip content={ChartTooltip} />
            <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#22d3ee" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.shape({
        client: PropTypes.string,
        month: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }),
  ),
};

CustomBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.string,
      month: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
};

export default CustomBarChart;
