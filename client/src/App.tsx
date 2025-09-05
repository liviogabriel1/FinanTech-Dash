// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Schedules } from './pages/Schedules';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { PendingVerification } from './pages/PendingVerification'; // 1. Importe
import { EmailVerified } from './pages/EmailVerified';       // 2. Importe

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending-verification" element={<PendingVerification />} /> {/* 3. Adicione */}
        <Route path="/email-verified" element={<EmailVerified />} />             {/* 4. Adicione */}

        {/* Rotas protegidas que usam o MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedules" element={<Schedules />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;