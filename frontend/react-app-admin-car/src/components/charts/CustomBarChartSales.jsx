import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';


const ModernTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
                        {data.value} vente{data.value > 1 ? 's' : ''}
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

const getPath = (x, y, width, height) => (
  `M${x},${y + height}
   C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
   C${x + width / 2},${y + height / 3} ${x + 2 * width / 3},${y + height} ${x + width}, ${y + height}
   Z`
);

const CustomTriangle = (props) => {
  const {
    fill, x, y, width, height,
  } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

const statusStyles = {
    'Confirmée': {
        color: '#8b5cf6',
        gradient: 'url(#violetGradient)',
        shadow: 'rgba(139, 92, 246, 0.3)'
    },
    'Payée': {
        color: '#10b981',
        gradient: 'url(#emeraldGradient)',
        shadow: 'rgba(16, 185, 129, 0.3)'
    },
    'En attente': {
        color: '#f59e0b',
        gradient: 'url(#amberGradient)',
        shadow: 'rgba(245, 158, 11, 0.3)'
    },
    'Annulée': {
        color: '#ef4444',
        gradient: 'url(#redGradient)',
        shadow: 'rgba(239, 68, 68, 0.3)'
    },
    'Inconnu': {
        color: '#6b7280',
        gradient: 'url(#grayGradient)',
        shadow: 'rgba(107, 114, 128, 0.3)'
    }
};

function CustomBarChartSales({ data = [] }) {
    const [hoveredBar, setHoveredBar] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
                        <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-slate-100 font-medium text-lg">Aucune donnée disponible</p>
                    <p className="text-slate-400 text-sm mt-1">Les statistiques apparaîtront ici</p>
                </div>
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const dataWithPercentage = data.map(item => ({
        ...item,
        percentage: total > 0 ? (item.value / total) * 100 : 0,
        color: statusStyles[item.name]?.color || statusStyles.Inconnu.color
    }));

    const maxValue = Math.max(...dataWithPercentage.map(item => item.value));

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
                    onMouseMove={(e) => {
                        if (e && e.activeTooltipIndex !== undefined) {
                            setHoveredBar(e.activeTooltipIndex);
                        }
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                >

                    <defs>
                        <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
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
                                fontSize: 10
                            }}
                        />
                    )}

                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: '#e2e8f0',
                            fontSize: 12,
                            fontWeight: 600
                        }}
                        height={60}
                        interval={0}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: '#cbd5e1',
                            fontSize: 11,
                            fontWeight: 500
                        }}
                        allowDecimals={false}
                        domain={[0, maxValue + 1]}
                    />

                    <Tooltip
                        content={<ModernTooltip />}
                        cursor={{
                            fill: 'rgba(139, 92, 246, 0.05)',
                            radius: 6,
                            stroke: 'rgba(139, 92, 246, 0.2)',
                            strokeWidth: 1
                        }}
                    />

                    <Bar
                        dataKey="value"
                        radius={[6, 6, 2, 2]}
                        name="Ventes"
                        shape={<CustomTriangle />}
                    >
                        {dataWithPercentage.map((entry, index) => {
                            const style = statusStyles[entry.name] || statusStyles.Inconnu;
                            const isHovered = hoveredBar === index;

                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={isHovered ? style.gradient : style.color}
                                    stroke={isHovered ? style.color : 'transparent'}
                                    strokeWidth={isHovered ? 2 : 0}
                                    opacity={isHovered ? 1 : 0.8}
                                />
                            );
                        })}
                    </Bar>
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

export default CustomBarChartSales;