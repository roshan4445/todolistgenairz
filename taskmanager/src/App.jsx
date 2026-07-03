import './App.css';
import Login from './components/login/Login';
import Register from './components/Register';
import { Route, Routes, Navigate } from 'react-router';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Routes>
       <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<Dashboard />} path="/dashboard" />
    </Routes>
  );
};

export default App;