import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Раньше маршруты жили после решётки (/#/pay). Ссылки, разосланные до перехода
// на обычные адреса, переводим на новый путь до монтирования роутера —
// иначе они молча открывали бы главную.
const legacyHash = window.location.hash;
if (legacyHash.startsWith('#/')) {
  window.history.replaceState(null, '', legacyHash.slice(1) + window.location.search);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
