import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CustomLineChart(props) {
  const data = Array.isArray(props.data) ? props.data : [];

  return (
    <div className="w-full chart-surface p-3" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            opacity={0.35}
          />
          <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ color: "#e2e8f0" }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ fill: "#67e8f9" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

CustomLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

CustomLineChart.defaultProps = {
  data: [],
};

export default CustomLineChart;
