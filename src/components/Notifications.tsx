import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, MessageSquare } from 'lucide-react';

// --- Types ---
type ToastType = 'success' | 'error' | 'info' | 'message';
interface Toast {
  id: string;
  type: ToastType;
  message: string;
  subMessage?: string;
}

const NotificationContext = createContext<any>(null);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, subMessage?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message, subMessage }]);
    setTimeout(() => removeToast(id), 5000); // Auto remove after 5s
  }, [removeToast]);

  return (
    <NotificationContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto bg-white/95 backdrop-blur-md border-l-4 shadow-2xl rounded-lg p-4 min-w-[300px] max-w-md animate-in slide-in-from-right duration-300 flex items-start gap-3"
            style={{ borderColor: t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : '#2563eb' }}>

            {/* Icon */}
            <div className="mt-0.5">
              {t.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
              {t.type === 'error' && <AlertCircle className="text-red-600" size={20} />}
              {t.type === 'info' && <Info className="text-blue-600" size={20} />}
              {t.type === 'message' && <MessageSquare className="text-orange-600" size={20} />}
            </div>

            {/* Content */}
            <div className="flex-grow">
              <h4 className={`font-black text-sm uppercase tracking-wide ${t.type === 'success' ? 'text-green-800' : t.type === 'error' ? 'text-red-800' : 'text-stone-800'}`}>
                {t.type}
              </h4>
              <p className="text-stone-600 text-sm font-bold mt-0.5">{t.message}</p>
              {t.subMessage && <p className="text-stone-400 text-xs mt-1 italic">{t.subMessage}</p>}
            </div>

            {/* Close */}
            <button onClick={() => removeToast(t.id)} className="text-stone-400 hover:text-stone-600"><X size={16} /></button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
