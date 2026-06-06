import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Monitor from "@/pages/Monitor";
import Resources from "@/pages/Resources";
import NavigationPage from "@/pages/Navigation";
import Communication from "@/pages/Communication";
import Missions from "@/pages/Missions";
import Crew from "@/pages/Crew";
import Alerts from "@/pages/Alerts";
import Maintenance from "@/pages/Maintenance";
import Experiments from "@/pages/Experiments";
import Emergency from "@/pages/Emergency";
import OperationLog from "@/pages/OperationLog";
import SettingsPage from "@/pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/crew" element={<Crew />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/logs" element={<OperationLog />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
