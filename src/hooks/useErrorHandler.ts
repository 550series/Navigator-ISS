import { useCallback } from "react";
import { useNotification } from "@/stores/notificationStore";

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { showToast = true, logToConsole = true, fallbackMessage = "操作失败，请稍后重试" } = options;
  const notify = useNotification();

  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      const message = customMessage || fallbackMessage;
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (logToConsole) {
        console.error("[Error]", errorMessage, error);
      }

      if (showToast) {
        notify.error("错误", message);
      }

      return { message: errorMessage };
    },
    [showToast, logToConsole, fallbackMessage, notify]
  );

  const handleAsyncError = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      errorMessage?: string
    ): Promise<{ data?: T; error?: { message: string } }> => {
      try {
        const data = await asyncFn();
        return { data };
      } catch (error) {
        const result = handleError(error, errorMessage);
        return { error: result };
      }
    },
    [handleError]
  );

  return { handleError, handleAsyncError };
}
