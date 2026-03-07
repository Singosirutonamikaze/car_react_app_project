import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({
  value,
  onChange,
  label,
  placeholder,
  type,
  name,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mt-3 mb-3">
      <label className="text-[13px] text-gray-300">{label}</label>
      <div className="input-box flex items-center bg-gray-800 rounded px-2 py-1 mt-2">
        <input
          type={inputType}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-500 p-1"
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEyeSlash
                size={22}
                className="text-violet-400 cursor-pointer ml-2"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEye
                size={22}
                className="text-gray-400 cursor-pointer ml-2"
                onClick={toggleShowPassword}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
};

Input.defaultProps = {
  value: "",
  onChange: undefined,
  label: "",
  placeholder: "",
  type: "text",
  name: "",
  required: false,
};

export default Input;
