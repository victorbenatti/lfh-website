import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { RankingPage } from './pages/RankingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { PaymentPage } from './pages/PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/inscricao" element={<RegistrationPage />} />
        <Route path="/pagamento/:id" element={<PaymentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        
        {/* Rota Protegida */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
