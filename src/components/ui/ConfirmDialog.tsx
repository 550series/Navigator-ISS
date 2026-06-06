import { useCallback } from "react";
import { create } from "zustand";
import { AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmOptions {
  title: string;
  message: string;
  type?: "danger" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions | null;
  showConfirm: (options: ConfirmOptions) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>()((set) => ({
  isOpen: false,
  options: null,
  showConfirm: (options) => set({ isOpen: true, options }),
  closeConfirm: () => set({ isOpen: false, options: null }),
}));

export function useConfirm() {
  const showConfirm = useConfirmStore((s) => s.showConfirm);

  const confirm = useCallback(
    (options: Omit<ConfirmOptions, "onConfirm"> & { onConfirm: () => void }) => {
      showConfirm(options);
    },
    [showConfirm]
  );

  return confirm;
}

const typeConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: "text-cyber-red",
    borderColor: "border-cyber-red/30",
    bgColor: "bg-cyber-red/5",
    confirmBg: "bg-cyber-red/20 hover:bg-cyber-red/30 text-cyber-red border-cyber-red/30",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-cyber-amber",
    borderColor: "border-cyber-amber/30",
    bgColor: "bg-cyber-amber/5",
    confirmBg: "bg-cyber-amber/20 hover:bg-cyber-amber/30 text-cyber-amber border-cyber-amber/30",
  },
  info: {
    icon: Info,
    iconColor: "text-cyber-blue",
    borderColor: "border-cyber-blue/30",
    bgColor: "bg-cyber-blue/5",
    confirmBg: "bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue border-cyber-blue/30",
  },
};

export default function ConfirmDialog() {
  const { isOpen, options, closeConfirm } = useConfirmStore();

  if (!isOpen || !options) return null;

  const config = typeConfig[options.type || "warning"];
  const Icon = config.icon;

  const handleConfirm = () => {
    options.onConfirm();
    closeConfirm();
  };

  const handleCancel = () => {
    options.onCancel?.();
    closeConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-md p-6 rounded-lg border ${config.borderColor} ${config.bgColor} bg-space-800`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-orbitron text-white mb-2">{options.title}</h3>
                <p className="text-sm text-gray-400">{options.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-xs rounded border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors font-rajdhani"
              >
                {options.cancelText || "取消"}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-xs rounded border transition-colors font-rajdhani ${config.confirmBg}`}
              >
                {options.confirmText || "确认"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
