import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, Protected, useAuth } from "./context/AuthContext";
import UserLayout from "./components/UserLayout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TicketDashboard from "./pages/TicketDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import UserSettings from "./pages/UserSettings";
import TicketChat from "./pages/TicketChat";
import VerifyUsers from "./pages/VerifyUsers";
import ExistingUsers from "./pages/ExistingUsers";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <Protected roles={["USER"]}>
                <UserLayout>
                  <Dashboard />
                </UserLayout>
              </Protected>
            }
          />
          <Route
            path="/agent-dashboard"
            element={
              <Protected roles={["AGENT", "ADMIN"]}>
                <UserLayout>
                  <AgentDashboard />
                </UserLayout>
              </Protected>
            }
          />
          <Route
            path="/account"
            element={
              <Protected>
                <UserLayout>
                  <UserSettings />
                </UserLayout>
              </Protected>
            }
          />
          <Route
            path="/view-tickets"
            element={
              <Protected roles={["USER"]}>
                <UserLayout>
                  <TicketDashboard />
                </UserLayout>
              </Protected>
            }
          />
          <Route
            path="/chat/:ticketId"
            element={
              <Protected>
                <TicketChat />
              </Protected>
            }
          />
          <Route
            path="/verify-users"
            element={
              <Protected roles={["ADMIN"]}>
                <UserLayout>
                  <VerifyUsers />
                </UserLayout>
              </Protected>
            }
          />
          <Route
            path="/existing-users"
            element={
              <Protected roles={["ADMIN"]}>
                <UserLayout>
                  <ExistingUsers />
                </UserLayout>
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
