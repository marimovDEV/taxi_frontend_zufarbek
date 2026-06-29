/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info, ShieldAlert } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  durationMs?: number;
}

export default function Toast({ message, type = 'success', onClose, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [onClose, durationMs]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-inverse-surface text-inverse-on-surface p-4 rounded-xl shadow-2xl border border-outline border-opacity-15 flex items-start gap-3.5 select-none animate-in slide-in-from-bottom-5 duration-300">
      {/* Toast Icons */}
      {type === 'success' && (
        <span className="p-1 bg-secondary/15 text-secondary-fixed rounded-lg shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </span>
      )}
      {type === 'error' && (
        <span className="p-1 bg-error-container/20 text-error-container rounded-lg shrink-0">
          <AlertCircle className="w-5 h-5 text-red-400" />
        </span>
      )}
      {type === 'warning' && (
        <span className="p-1 bg-amber-500/15 text-amber-300 rounded-lg shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </span>
      )}
      {type === 'info' && (
        <span className="p-1 bg-primary/20 text-primary-fixed rounded-lg shrink-0">
          <Info className="w-5 h-5" />
        </span>
      )}

      {/* Message content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="font-body-md text-xs font-bold leading-tight">{message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="text-outline-variant hover:text-inverse-on-surface p-0.5 rounded-lg hover:bg-surface-container/20 transition-all cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
