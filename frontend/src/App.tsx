import { Routes, Route } from "react-router-dom"
import TestPage from "./pages/TestPage"
import HRrequirements from "./pages/HRrequirements"

function App() {
  return (
    <>
      <Routes>
        <Route path="testpage" element={<TestPage />} />
        <Route path="hrrequirements" element={<HRrequirements />} />
      </Routes>
    </>
  )
}

export default App
