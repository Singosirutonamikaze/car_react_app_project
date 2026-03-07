import React from "react";
import PropTypes from "prop-types";

function InformationCardStats({
  icon,
  label,
  value,
  color,
  textColor,
  className,
}) {
  const rootClass =
    "rounded-lg p-5 flex items-center justify-between border border-cyan-300/20 bg-[#07314F]/58 " +
    (className || "");
  const iconWrapClass =
    "flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-md " +
    (color || "bg-cyan-600");
  const valueClass = "text-2xl font-bold " + (textColor || "text-slate-100");

  return (
    <div className={rootClass}>
      <div className="flex items-center gap-4">
        <div className={iconWrapClass}>{icon}</div>
        <div>
          <p className="text-slate-300 text-sm">{label}</p>
          <p className={valueClass}>{value}</p>
        </div>
      </div>
    </div>
  );
}

InformationCardStats.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  textColor: PropTypes.string,
  className: PropTypes.string,
};

export default InformationCardStats;
