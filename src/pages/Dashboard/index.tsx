import SystemStatusCards from "./SystemStatusCards";
import StationDiagram from "./StationDiagram";
import CoreGauges from "./CoreGauges";
import AlertSummary from "./AlertSummary";
import NavigationSummary from "./NavigationSummary";
import MissionSummary from "./MissionSummary";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <SystemStatusCards />

      <div className="grid grid-cols-3 gap-4">
        <StationDiagram />
        <CoreGauges />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AlertSummary />
        <NavigationSummary />
        <MissionSummary />
      </div>
    </div>
  );
}
