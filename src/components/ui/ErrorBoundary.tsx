import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center p-6 max-w-md">
            <AlertTriangle size={48} className="mx-auto mb-4 text-cyber-amber" />
            <h2 className="text-lg font-orbitron text-white mb-2">系统异常</h2>
            <p className="text-sm text-gray-400 mb-4">
              组件渲染过程中发生错误，请尝试刷新页面或重置系统。
            </p>
            {this.state.error && (
              <details className="mb-4 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                  错误详情
                </summary>
                <pre className="mt-2 text-[10px] text-cyber-red bg-space-900/50 p-2 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 mx-auto px-4 py-2 text-xs rounded border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 transition-colors font-rajdhani"
            >
              <RefreshCw size={12} /> 重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
