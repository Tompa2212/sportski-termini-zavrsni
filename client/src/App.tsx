import './styles/variables.css';
import './styles/sass/main.css';

import React from 'react';
import { AuthProvider } from './providers/authProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Authorization Pages/LoginPage';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './pages/ProtectedRoute';

function App() {
  React.useLayoutEffect(() => {
    document.body.dataset.theme = 'light';
  });

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/sportTerms"
            element={
              <ProtectedRoute>
                <div>Sportski Termini</div>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
