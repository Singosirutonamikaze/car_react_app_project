import PropTypes from "prop-types";

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-cyan-300/30 bg-[#07314F]/95 p-3 shadow-lg">
        <p className="mb-1 text-xs font-semibold text-cyan-100">
          {payload[0].name}
        </p>
        <p className="text-sm text-slate-200">
          Total :{" "}
          <span className="text-sm font-medium text-white">
            {payload[0].value}{" "}
          </span>
        </p>
      </div>
    );
  }

  return null;
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
};

export default CustomTooltip;
