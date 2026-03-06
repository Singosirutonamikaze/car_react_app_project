import React, { Component } from 'react'

class Select extends Component {
  render() {
    const { name, label, value, onChange, required, options } = this.props;

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
            {label}
          </label>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Sélectionnez --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className='text-gray-700'>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default Select;