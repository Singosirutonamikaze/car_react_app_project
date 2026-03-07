import React from "react";
import PropTypes from "prop-types";

function CardAvatar({
  fullName = "",
  width = "w-20",
  height = "h-20",
  style = "text-xl",
}) {
  let initials = "";
  if (fullName) {
    const names = fullName
      .trim()
      .split(" ")
      .filter((n) => n.length > 0);
    for (const name of names) {
      if (name?.[0]) {
        initials += name[0].toUpperCase();
      }
    }
  }

  return (
    <div
      className={`${width} ${height} ${style} rounded-full text-gray-900 font-medium bg-purple-200 flex items-center justify-center border border-violet-500`}
    >
      {initials}
    </div>
  );
}

CardAvatar.propTypes = {
  fullName: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.string,
};

export default CardAvatar;
