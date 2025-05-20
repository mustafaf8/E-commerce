import "react";
import PropTypes from "prop-types";

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p className="mb-4">{message}</p>
        <div className="flex justify-around">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Evet
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            Hayır
          </button>
        </div>
      </div>
    </div>
  );
};
ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ConfirmationModal;
