import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/public/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/public/HomePage';
import ResultsPage from './pages/public/ResultsPage';
import GamesPage from './pages/public/GamesPage';
import CheckNumbersPage from './pages/public/CheckNumbersPage';
import WinnersPage from './pages/public/WinnersPage';
import HowToPlayPage from './pages/public/HowToPlayPage';
import ImpactPage from './pages/public/ImpactPage';
import AboutPage from './pages/public/AboutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDraws from './pages/admin/AdminDraws';
import AdminAgents from './pages/admin/AdminAgents';
import AdminReports from './pages/admin/AdminReports';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminLogin from './pages/admin/AdminLogin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/check-numbers" element={<CheckNumbersPage />} />
          <Route path="/winners" element={<WinnersPage />} />
          <Route path="/how-to-play" element={<HowToPlayPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/draws" element={<AdminDraws />} />
          <Route path="/admin/agents" element={<AdminAgents />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/security" element={<AdminSecurity />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
