import { useState, useEffect, useCallback } from "react";

export interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(({ ...props }: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props]);
  }, []);

  const dismissToast = useCallback((index: number) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dismissToast(0);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toasts, dismissToast]);

  return { toast, toasts, dismissToast };
}
