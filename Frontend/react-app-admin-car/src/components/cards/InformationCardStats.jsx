import React, { Component } from 'react'

class InformationCardStats extends Component {
    render() {

        const { icon, label, value, color } = this.props;

        return (
           <div className={`bg-[#0e1323c4] shadow-md rounded-lg p-6 flex items-center justify-between ${color}`}>
                <div className="flex items-center">
                    {icon}
                    <div className="ml-9 text-center">
                        <p className="text-slate-300 text-sm">{label}</p>
                        <p className="text-2xl font-bold text-slate-100">{value}</p>
                    </div>
                </div>
           </div>
        )
    }
}

export default InformationCardStats;
