import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-space-900 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 size={32} className="animate-spin text-cyber-blue mx-auto mb-4" />
        <div className="font-orbitron text-sm text-cyber-blue tracking-wider">LOADING</div>
        <div className="text-[10px] text-gray-500 mt-1 font-rajdhani">Navigator ISS System</div>
      </div>
    </div>
  );
}
