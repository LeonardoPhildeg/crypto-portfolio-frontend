import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Historico from "./pages/Historico";
import Header from "./components/Header";

function App() {
  return (
    <div className="bg-primary min-h-screen text-white font-sans">
      <BrowserRouter>
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/historico" element={<Historico />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
