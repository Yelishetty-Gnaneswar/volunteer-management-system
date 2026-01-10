import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRole, children }) => {
  const role = localStorage.getItem("role");
  const sessionId = localStorage.getItem("sessionId");

  if (!role || !sessionId) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
