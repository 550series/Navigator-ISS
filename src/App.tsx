import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Monitor from "@/pages/Monitor";
import Resources from "@/pages/Resources";
import NavigationPage from "@/pages/Navigation";
import Communication from "@/pages/Communication";
import Missions from "@/pages/Missions";
import Crew from "@/pages/Crew";

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
        </Route>
      </Routes>
    </Router>
  );
}
