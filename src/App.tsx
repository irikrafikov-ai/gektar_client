import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TulaPage } from './pages/TulaPage';
import { TverPage } from './pages/TverPage';
import { CrimeaPage } from './pages/CrimeaPage';
import { MoscowPage } from './pages/MoscowPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { PaymentPage } from './pages/PaymentPage';
import { PaymentResultPage } from './pages/PaymentResultPage';
import { RequisitesPage } from './pages/RequisitesPage';
import { OfferPage } from './pages/OfferPage';
import { PolicyPage } from './pages/PolicyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tula" element={<TulaPage />} />
        <Route path="/tver" element={<TverPage />} />
        <Route path="/crimea" element={<CrimeaPage />} />
        <Route path="/moscow" element={<MoscowPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/pay" element={<PaymentPage />} />
        <Route path="/pay/result" element={<PaymentResultPage />} />
        <Route path="/requisites" element={<RequisitesPage />} />
        <Route path="/offer" element={<OfferPage />} />
        <Route path="/privacy" element={<PolicyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
