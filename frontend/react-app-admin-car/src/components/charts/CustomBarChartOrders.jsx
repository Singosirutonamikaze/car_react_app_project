import PropTypes from "prop-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomBarChartOrders({ data = [] }) {
  return (
    <div className="w-full h-96 chart-surface p-4">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="ordersAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            opacity={0.35}
          />
          <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            fillOpacity={1}
            fill="url(#ordersAreaGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

CustomBarChartOrders.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default CustomBarChartOrders;
