/** 格式化数值，保留指定小数位 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/** 格式化百分比 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** 格式化大数字（带单位） */
export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(1);
}

/** 获取状态对应的颜色 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "normal":
    case "healthy":
    case "online":
    case "operational":
    case "connected":
    case "completed":
      return "text-cyber-green";
    case "warning":
    case "minor":
    case "degraded":
    case "low":
    case "in_progress":
    case "planned":
      return "text-cyber-amber";
    case "critical":
    case "injured":
    case "offline":
    case "aborted":
      return "text-cyber-red";
    default:
      return "text-gray-400";
  }
}

/** 获取状态对应的背景色 */
export function getStatusBgColor(status: string): string {
  switch (status) {
    case "normal":
    case "healthy":
    case "online":
    case "operational":
    case "connected":
    case "completed":
      return "bg-cyber-green/10 border-cyber-green/30";
    case "warning":
    case "minor":
    case "degraded":
    case "low":
    case "in_progress":
    case "planned":
      return "bg-cyber-amber/10 border-cyber-amber/30";
    case "critical":
    case "injured":
    case "offline":
    case "aborted":
      return "bg-cyber-red/10 border-cyber-red/30";
    default:
      return "bg-gray-500/10 border-gray-500/30";
  }
}

/** 获取告警等级对应的颜色 */
export function getAlertLevelColor(level: string): string {
  switch (level) {
    case "critical":
      return "text-cyber-red";
    case "warning":
      return "text-cyber-amber";
    case "info":
      return "text-cyber-blue";
    default:
      return "text-gray-400";
  }
}

/** 获取告警等级对应的背景色 */
export function getAlertLevelBgColor(level: string): string {
  switch (level) {
    case "critical":
      return "bg-cyber-red/10 border-cyber-red/30";
    case "warning":
      return "bg-cyber-amber/10 border-cyber-amber/30";
    case "info":
      return "bg-cyber-blue/10 border-cyber-blue/30";
    default:
      return "bg-gray-500/10 border-gray-500/30";
  }
}

/** 获取优先级对应的颜色 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "critical":
      return "text-cyber-red";
    case "high":
      return "text-cyber-amber";
    case "medium":
      return "text-cyber-blue";
    case "low":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
}

/** 在基础值上添加随机波动 */
export function addFluctuation(base: number, range: number): number {
  return base + (Math.random() - 0.5) * 2 * range;
}

/** 限制数值在范围内 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
