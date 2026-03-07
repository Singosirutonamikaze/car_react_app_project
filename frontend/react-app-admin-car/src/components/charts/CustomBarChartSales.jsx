import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import EmptyState from "../alerts/EmptyState";

const ModernTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const data = payload[0];
    const percentage = data.payload.percentage || 0;

    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-violet-500/30 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.payload.color || data.fill }}
          />
          <p className="text-slate-100 font-semibold">{label}</p>
        </div>
        <div className="space-y-1">
          <p className="text-violet-400 font-bold text-lg">
            {data.value} vente{data.value > 1 ? "s" : ""}
          </p>
          {percentage > 0 && (
            <p className="text-slate-300 text-sm">
              {percentage.toFixed(1)}% du total
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const getPath = (x, y, width, height) =>
  `M${x},${y + height}
   C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
   C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
   Z`;

const CustomTriangle = (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

const statusStyles = {
  Confirmée: {
    color: "#22d3ee",
    gradient: "url(#cyanGradient)",
    shadow: "rgba(34, 211, 238, 0.3)",
  },
  Payée: {
    color: "#10b981",
    gradient: "url(#emeraldGradient)",
    shadow: "rgba(16, 185, 129, 0.3)",
  },
  "En attente": {
    color: "#f59e0b",
    gradient: "url(#amberGradient)",
    shadow: "rgba(245, 158, 11, 0.3)",
  },
  Annulée: {
    color: "#ef4444",
    gradient: "url(#redGradient)",
    shadow: "rgba(239, 68, 68, 0.3)",
  },
  Inconnu: {
    color: "#6b7280",
    gradient: "url(#grayGradient)",
    shadow: "rgba(107, 114, 128, 0.3)",
  },
};

function CustomBarChartSales({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <EmptyState
          title="Aucune donnée disponible"
          message="Les statistiques apparaîtront ici."
          compact
        />
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
    color: statusStyles[item.name]?.color || statusStyles.Inconnu.color,
    fill: statusStyles[item.name]?.color || statusStyles.Inconnu.color,
  }));

  const maxValue = Math.max(...dataWithPercentage.map((item) => item.value));

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataWithPercentage}
          margin={{
            top: 25,
            right: 30,
            left: 20,
            bottom: 25,
          }}
          barCategoryGap="25%"
        >
          <defs>
            <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.92} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.74} />
            </linearGradient>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="grayGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6b7280" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="2 4"
            stroke="#334155"
            opacity={0.2}
            horizontal={true}
            vertical={false}
          />

          {total > 0 && (
            <ReferenceLine
              y={total / data.length}
              stroke="#64748b"
              strokeDasharray="3 3"
              opacity={0.5}
              label={{
                value: "Moyenne",
                position: "topRight",
                fill: "#94a3b8",
                fontSize: 10,
              }}
            />
          )}

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#e2e8f0",
              fontSize: 12,
              fontWeight: 600,
            }}
            height={60}
            interval={0}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#cbd5e1",
              fontSize: 11,
              fontWeight: 500,
            }}
            allowDecimals={false}
            domain={[0, maxValue + 1]}
          />

          <Tooltip
            content={<ModernTooltip />}
            cursor={{
              fill: "rgba(139, 92, 246, 0.05)",
              radius: 6,
              stroke: "rgba(34, 211, 238, 0.28)",
              strokeWidth: 1,
            }}
          />

          <Bar
            dataKey="value"
            radius={[6, 6, 2, 2]}
            name="Ventes"
            shape={<CustomTriangle />}
            fill="#22d3ee"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="absolute bottom-0 right-0 bg-slate-800/60 backdrop-blur-sm rounded-tl-lg px-3 py-1">
        <span className="text-slate-300 text-xs font-medium">
          Total: {total} ventes
        </span>
      </div>
    </div>
  );
}

ModernTooltip.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      fill: PropTypes.string,
      value: PropTypes.number,
      payload: PropTypes.shape({
        color: PropTypes.string,
        percentage: PropTypes.number,
      }),
    }),
  ),
};

CustomTriangle.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

CustomBarChartSales.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
};

export default CustomBarChartSales;
