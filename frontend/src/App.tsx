import { Routes, Route } from "react-router-dom";
import HRrequirements from "./pages/HRrequirements";
import CV from "./pages/CV";
import Dashboard from "./pages/Dashboard";
import ParticlesBackground from "./components/ParticlesBackground";
import Header from "./components/Header";
import { HRRequirementsProvider } from "./context/context";

function App() {
  return (
    <div className="relative min-h-screen bg-slate-900 text-white">
      <ParticlesBackground />
      <Header />

      <main className="relative z-10 pt-16">
        <HRRequirementsProvider>
          <Routes>
            <Route path="/cv" element={<CV />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hrrequirements" element={<HRrequirements />} />
          </Routes>
        </HRRequirementsProvider>
      </main>
    </div>
  );
}

export default App;
