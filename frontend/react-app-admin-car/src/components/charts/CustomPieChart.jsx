import React, { Component } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import CustomLegend from './CustomLegend';
import CustomTooltip from './CustomTooltip';

class CustomPieChart extends Component {
    render() {
        const {
            data,
            label,
            totalAmount,
            colors,
            showTextAnchor
        } = this.props;

        if (!Array.isArray(data)) {
            console.error("Invalid data prop passed to CustomPieChart:", data);
            return (
                <div className='flex items-center justify-center h-full'>Aucune donnée disponible</div>
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
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={CustomTooltip} />
                    <Legend content={CustomLegend} />

                    {
                        showTextAnchor && (
                            <>
                                <text
                                    x="50%"
                                    y="50%"
                                    dy={-25}
                                    textAnchor="middle"
                                    fill='#679'
                                    fontSize='14px'
                                >
                                    {label}
                                </text>
                                <text
                                    x="50%"
                                    y="50%"
                                    dy={8}
                                    textAnchor="middle"
                                    fill='#333'
                                    fontSize='24px'
                                    fontWeight='semi-bold'
                                >
                                    {totalAmount}
                                </text>
                            </>
                        )
                    }

                </PieChart>
            </ResponsiveContainer>
        );
    }
}

export default CustomPieChart;
