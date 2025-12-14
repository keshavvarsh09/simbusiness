/**
 * Confirmation Dialog Component
 * Reusable confirmation dialog for important actions
 */

'use client';

import { FiAlertTriangle, FiX, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info'
}: ConfirmationDialogProps) {

  const variantStyles = {
    danger: {
      button: 'btn-danger',
      icon: 'text-red-500',
      bg: 'bg-red-50',
      Icon: FiAlertTriangle
    },
    warning: {
      button: 'btn-warning',
      icon: 'text-amber-500',
      bg: 'bg-amber-50',
      Icon: FiAlertTriangle
    },
    info: {
      button: 'btn-primary',
      icon: 'text-blue-500',
      bg: 'bg-blue-50',
      Icon: FiInfo
    },
    success: {
      button: 'btn-success',
      icon: 'text-green-500',
      bg: 'bg-green-50',
      Icon: FiCheckCircle
    }
  };

  const styles = variantStyles[variant];
  const Icon = styles.Icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-apple-xl w-full max-w-sm p-6 relative z-10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-full ${styles.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`${styles.icon} text-xl`} />
              </div>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <h3 className="text-title-3 font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-body text-gray-500 mb-6">{message}</p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="btn btn-ghost"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`btn ${styles.button}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
