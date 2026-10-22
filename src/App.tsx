// src/App.tsx — Router root
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import DemoPage from './pages/DemoPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/demo" element={<DemoPage />} />
    </Routes>
  );
}
