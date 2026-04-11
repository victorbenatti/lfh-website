import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { RankingPage } from './pages/RankingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/inscricao" element={<RegistrationPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
