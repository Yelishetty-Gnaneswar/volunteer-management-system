import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/profile/ProfilePage";

import ProtectedRoute from "./routes/ProtectedRoute";

import VolunteerDashboard from "./pages/volunteer/Dashboard";
import OrganizerDashboard from "./pages/organizer/Dashboard";
import Participants from "./pages/organizer/Participants";
import EditEvent from "./pages/organizer/EditEvent";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Volunteer */}
        <Route
          path="/volunteer/dashboard"
          element={
            <ProtectedRoute allowedRole="VOLUNTEER">
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Organizer */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRole="ORGANIZER">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/:eventId/edit"
          element={
            <ProtectedRoute allowedRole="ORGANIZER">
              <EditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/:eventId/participants"
          element={
            <ProtectedRoute allowedRole="ORGANIZER">
              <Participants />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
