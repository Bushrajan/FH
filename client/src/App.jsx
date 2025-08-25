import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext.jsx';
import { publicRoutes, adminRoutes, userRoutes } from './router/routes.js';
import NotFound from './pages/NotFound.jsx';

function App() {
  const { loading, user } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 ">Loading . . . </p>
      </div>
    );
  }

  // Helper to check authentication
  const isAuthenticated = !!user;
  const isAdmin = user?.role;


  {/* Fallback route for 404 */ }
  <Route path="*" element={<NotFound />} />

  console.log(isAuthenticated, isAdmin, user);

  return (
    <Router>
      <div className="App ">
        <Routes>
          {/* Always show login as the first route */}
          {publicRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={<Component />}
            />
          ))}

          {/* Admin protected routes */}
          {adminRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                isAuthenticated
                  ? <Component />
                  : <Navigate to="/login" replace />
              }
            />
          ))}

          {/* User protected routes */}
          {userRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                isAuthenticated
                  ? <Component />
                  : <Navigate to="/login" replace />
              }
            />
          ))}

          {/* Fallback route for 404 */}
          <Route path="*" element={<NotFound/> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;