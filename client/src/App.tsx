import './styles/variables.css';
import './styles/sass/main.css';

import React from 'react';
import { AuthProvider } from './providers/authProvider';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from './pages/Authorization Pages/LoginPage';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { RegisterPage } from './pages/Authorization Pages/RegisterPage';
import { Navigation } from './components/Navigation/Navigation';
import { ApiProvider } from './providers/apiProvider';
import { localStorageUtil } from './utils/localStorage';
import { HomePage } from './pages/HomePage';

const getBearerToken = () => {
  return localStorageUtil.getItem('user').token;
};

function App() {
  React.useLayoutEffect(() => {
    document.body.dataset.theme = 'light';
  });

  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider getBearerToken={getBearerToken}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              element={
                <>
                  <Navigation />
                  <div className="container">
                    <Outlet />
                  </div>
                </>
              }
            >
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
