import { useCallback } from "react";

export function useConfirmAction() {
  const confirmAction = useCallback((message: string, action: () => void) => {
    if (window.confirm(message)) {
      action();
    }
  }, []);

  const confirmDelete = useCallback((itemName: string, action: () => void) => {
    confirmAction(`确定删除「${itemName}」？此操作不可撤销。`, action);
  }, [confirmAction]);

  const confirmReset = useCallback((itemName: string, action: () => void) => {
    confirmAction(`确定重置「${itemName}」数据？`, action);
  }, [confirmAction]);

  return {
    confirmAction,
    confirmDelete,
    confirmReset,
  };
}
