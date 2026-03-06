import React, { Component } from 'react'

class InfoCardForm extends Component {
  render() {
    const { icon, label, value, color, textColor, className } = this.props;
    return (
      <div className={`flex items-center p-4 rounded-lg ${className}`}>
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className={`text-sm ${textColor}`}>{label}</p>
          <p className={`text-lg font-semibold ${textColor}`}>{value}</p>
        </div>
      </div>
    )
  }
}

export default InfoCardForm;
