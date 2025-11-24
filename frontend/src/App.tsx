import { Routes, Route, Navigate } from "react-router-dom";
import HRrequirements from "./pages/HRrequirements";
import CV from "./pages/CV";
import Dashboard from "./pages/Dashboard";
import ParticlesBackground from "./components/ParticlesBackground";
import Header from "./components/Header";
import { HRRequirementsProvider } from "./context/context";

function App() {
  return (
    <div>
      <ParticlesBackground />
      <Header />

      <main className="relative pt-16">
        <HRRequirementsProvider>
          <Routes>
            <Route path="/cv" element={<CV />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hrrequirements" element={<HRrequirements />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </HRRequirementsProvider>
      </main>
    </div>
  );
}

export default App;
