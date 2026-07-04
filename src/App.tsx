import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TulaPage } from './pages/TulaPage';
import { TverPage } from './pages/TverPage';
import { CrimeaPage } from './pages/CrimeaPage';
import { MoscowPage } from './pages/MoscowPage';
import { CalculatorPage } from './pages/CalculatorPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tula" element={<TulaPage />} />
        <Route path="/tver" element={<TverPage />} />
        <Route path="/crimea" element={<CrimeaPage />} />
        <Route path="/moscow" element={<MoscowPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
