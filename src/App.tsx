import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LoadingScreen from "@/components/ui/LoadingScreen";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Monitor = lazy(() => import("@/pages/Monitor"));
const Resources = lazy(() => import("@/pages/Resources"));
const NavigationPage = lazy(() => import("@/pages/Navigation"));
const Communication = lazy(() => import("@/pages/Communication"));
const Missions = lazy(() => import("@/pages/Missions"));
const Crew = lazy(() => import("@/pages/Crew"));
const Alerts = lazy(() => import("@/pages/Alerts"));
const Maintenance = lazy(() => import("@/pages/Maintenance"));
const Experiments = lazy(() => import("@/pages/Experiments"));
const Emergency = lazy(() => import("@/pages/Emergency"));
const OperationLog = lazy(() => import("@/pages/OperationLog"));
const SettingsPage = lazy(() => import("@/pages/Settings"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
    </Router>
  );
}
