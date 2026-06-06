import { useNotificationStore } from "@/stores/notificationStore";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: "border-cyber-green/40 bg-cyber-green/10 text-cyber-green",
  error: "border-cyber-red/40 bg-cyber-red/10 text-cyber-red",
  warning: "border-cyber-amber/40 bg-cyber-amber/10 text-cyber-amber",
  info: "border-cyber-blue/40 bg-cyber-blue/10 text-cyber-blue",
};

export default function NotificationContainer() {
  const notifications = useNotificationStore((s) => s.notifications);
  const removeNotification = useNotificationStore((s) => s.removeNotification);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = icons[notification.type];
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded border backdrop-blur-sm ${colors[notification.type]}`}
            >
              <div className="flex items-start gap-2">
                <Icon size={16} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-rajdhani font-bold">{notification.title}</div>
                  {notification.message && (
                    <div className="text-[10px] opacity-80 mt-0.5">{notification.message}</div>
                  )}
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
