import { useEffect, useState } from "react";
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-cyan-300/35 bg-[#07314F]/95 p-3 text-white shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-slate-200">{`Voitures ajoutées : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
    }),
  ),
  label: PropTypes.string,
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: "",
};

function CustomCarChart({ data }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity={1} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.78} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            fontSize={12}
            tick={{ fill: "#9CA3AF" }}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            filter="url(#glow)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

CustomCarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
};

CustomCarChart.defaultProps = {
  data: [],
};

export default CustomCarChart;
