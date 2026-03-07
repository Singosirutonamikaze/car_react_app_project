import React from "react";
import PropTypes from "prop-types";

function InfoCardForm({ icon, label, value, color, textColor, className }) {
  return (
    <div className={`flex items-center p-4 rounded-lg ${className}`}>
      <div
        className={`shrink-0 w-12 h-12 rounded-full ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <p className={`text-sm ${textColor}`}>{label}</p>
        <p className={`text-lg font-semibold ${textColor}`}>{value}</p>
      </div>
    </div>
  );
}

InfoCardForm.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  textColor: PropTypes.string,
  className: PropTypes.string,
};

export default InfoCardForm;
