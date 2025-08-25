import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) return null; 
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

export default ProtectedRoutes;
