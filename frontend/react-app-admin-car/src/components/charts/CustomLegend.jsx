import React from "react";
import PropTypes from "prop-types";

function CustomLegend({ payload = [] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 space-x-6">
      {payload.map((entry) => (
        <div
          key={`legend-item-${entry.value || entry.color}`}
          className="flex items-center space-x-2"
        >
          <div
            className="w-2.5 h-2.5 rounded-lg"
            style={{ backgroundColor: entry.color }}
          ></div>

          <span className="text-xs text-gray-700 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

CustomLegend.propTypes = {
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
};

export default CustomLegend;
