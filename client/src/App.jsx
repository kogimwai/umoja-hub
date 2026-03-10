import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobBoard from './pages/JobBoard';
import JobPost from './pages/JobPost';
import Marketplace from './pages/Marketplace';
import AuctionRoom from './pages/AuctionRoom';
import AIAssistant from './pages/AIAssistant';
import Portfolio from './pages/Portfolio';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-umoja-dark flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-umoja-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-umoja-dark text-umoja-cream font-body">
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/auction/:id" element={<AuctionRoom />} />
          <Route path="/profile/:id" element={<Portfolio />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/jobs/post" element={
            <PrivateRoute><JobPost /></PrivateRoute>
          } />
          <Route path="/ai-assistant" element={
            <PrivateRoute><AIAssistant /></PrivateRoute>
          } />
          <Route path="/portfolio" element={
            <PrivateRoute><Portfolio /></PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
