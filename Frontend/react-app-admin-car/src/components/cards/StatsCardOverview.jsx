import React, { Component } from 'react'

class StatsCardOverview extends Component {
  render() {
    const { icon, label, value, color, textColor, className } = this.props;
    return (
      <div className={`bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div>
            <p className={`text-slate-300 text-sm`}>{label}</p>
            <div className={`text-2xl font-bold ${textColor}`}>
              {value}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default StatsCardOverview;
