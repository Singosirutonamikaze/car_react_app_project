import React, { Component } from 'react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

class CustomBarChartOrders extends Component {
    render() {
        const { data = [] } = this.props;
        return (
            <div className='w-full h-96 bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default CustomBarChartOrders;