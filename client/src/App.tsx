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
import { appStorage } from './utils/app storage';
import { HomePage } from './pages/HomePage';
import { SocialProvider } from './providers/socialProvider';
import { UserPage } from './pages/User Page/UserPage';
import { SportTermCreate } from './pages/Sport Term Create/SportTermCreate';
import { UserEditPage } from './pages/User Edit Page/UserEditPage';
import { InitalizeUserModal } from './pages/User Initialize/InitalizeUserModal';

const getBearerToken = () => {
  return appStorage.getItem('user')?.token;
};

function App() {
  React.useLayoutEffect(() => {
    document.body.dataset.theme = 'light';
  });

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <>
                <ApiProvider getBearerToken={getBearerToken}>
                  <SocialProvider>
                    <Navigation />
                    <Outlet />
                  </SocialProvider>
                </ApiProvider>
              </>
            }
          >
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="container">
                    <HomePage />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/istrazi"
              element={
                <ProtectedRoute>
                  <div>Istraži</div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/kreiraj"
              element={
                <ProtectedRoute>
                  <div className="container">
                    <SportTermCreate />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/korisnik/:username"
              element={
                <ProtectedRoute>
                  <div className="container">
                    <UserPage />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/racun/uredi"
              element={
                <ProtectedRoute>
                  <div className="container">
                    <UserEditPage />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/inicijalizacija" element={<InitalizeUserModal />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
