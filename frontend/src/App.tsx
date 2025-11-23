import { Routes, Route } from "react-router-dom";
import HRrequirements from "./pages/HRrequirements";
import CV from "./pages/CV";
import Dashboard from "./pages/Dashboard";
import ParticlesBackground from "./components/ParticlesBackground";
import Header from "./components/Header";

function App() {
  return (
    <>
      <ParticlesBackground />
      <Header />

      <main className="relative z-10 pt-16">
        <Routes>
          <Route path="/cv" element={<CV />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hrrequirements" element={<HRrequirements />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
