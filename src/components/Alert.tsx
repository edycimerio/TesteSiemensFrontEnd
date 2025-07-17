import React, { useEffect, useState } from 'react';

type AlertType = 'success' | 'error' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  duration?: number; // Duração em ms, se não fornecido o alerta não desaparece automaticamente
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, duration, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {message}
      </div>
      <button className="alert-close" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default Alert;
