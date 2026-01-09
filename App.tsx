import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './contexts/StoreContext';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/ChatPage';
import { AdminPage } from './pages/AdminPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { auth } = useStore();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !auth.user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { auth } = useStore();
    return (
        <Routes>
            <Route path="/login" element={auth.isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
            
            <Route path="/" element={
                <ProtectedRoute>
                    <ChatPage />
                </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                    <AdminPage />
                </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </StoreProvider>
  );
};

export default App;