import React from "react";
import PropTypes from "prop-types";

function DeleteAlert({ message, onCancel, onDelete }) {
  return (
    <div className="flex w-full h-auto text-center p-4 flex-col space-x-4">
      <div className="text-lg font-semibold text-white mb-6">{message}</div>
      <div className="flex justify-around w-full">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
          Annuler
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Supprimé
        </button>
      </div>
    </div>
  );
}

DeleteAlert.propTypes = {
  message: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DeleteAlert;
