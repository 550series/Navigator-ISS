import { useEffect } from "react";
import { useStationStore } from "@/stores/stationStore";
import { useResourceStore } from "@/stores/resourceStore";
import { useNavigationStore } from "@/stores/navigationStore";
import { useCommStore } from "@/stores/commStore";
import { clamp } from "@/utils/formatters";

export function useSystemInterconnection() {
  useEffect(() => {
    const interval = setInterval(() => {
      const station = useStationStore.getState();
      const resource = useResourceStore.getState();

      // 能源不足影响生命维持
      const energyRatio = station.energy.reactorOutput / station.energy.reactorOutputMax;
      if (energyRatio < 0.5) {
        useStationStore.setState((s) => ({
          lifeSupport: {
            ...s.lifeSupport,
            oxygenLevel: clamp(s.lifeSupport.oxygenLevel - 0.02, 18, 23),
            temperature: clamp(s.lifeSupport.temperature - 0.1, 18, 28),
          },
        }));
      }

      // 人员伤亡影响任务执行
      const injuredCount = resource.personnel.filter((p) => p.healthStatus === "injured").length;
      if (injuredCount > 2) {
        useStationStore.setState((s) => ({
          energy: {
            ...s.energy,
            consumption: clamp(s.energy.consumption + 5, 400, 900),
          },
        }));
      }

      // 推进系统故障影响导航
      if (station.propulsion.engineStatus !== "online") {
        useNavigationStore.setState((s) => ({
          navigation: {
            ...s.navigation,
            deviation: clamp(s.navigation.deviation + 0.0001, 0, 0.01),
          },
        }));
      }

      // 通信链路状态影响信号强度
      const commState = useCommStore.getState();
      const offlineLinks = commState.commLinks.filter((l) => l.status === "offline").length;
      if (offlineLinks > 2) {
        useStationStore.setState((s) => ({
          lifeSupport: {
            ...s.lifeSupport,
            airQuality: clamp(s.lifeSupport.airQuality - 0.1, 60, 100),
          },
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);
}
