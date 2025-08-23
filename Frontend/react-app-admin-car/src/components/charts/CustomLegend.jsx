import React, { Component } from 'react'

class CustomLegend extends Component {
    render() {
        const { payload } = this.props;
        return (
            <div className='flex flex-wrap justify-center gap-2 mt-4 space-x-6'>
                {
                    payload.map((entry, index) => (
                        <div key={`legend-item-${index}`} className='flex items-center space-x-2'>
                            <div
                                className='w-2.5 h-2.5 rounded-lg'
                                style={{ backgroundColor: entry.color }}
                            ></div>
                
                            <span className='text-xs text-gray-700 font-medium'>
                                {entry.value}
                            </span>
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default CustomLegend;