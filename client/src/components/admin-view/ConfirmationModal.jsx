import "react";
import PropTypes from "prop-types";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-sm w-full animate-in fade-in duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          
          <h3 className="text-lg font-medium">Onay</h3>
          
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
          
          <div className="flex gap-3 w-full mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              İptal
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={onConfirm}
            >
              Onayla
            </Button>
          </div>
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
