import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, Protected } from "./context/AuthContext";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TicketDashboard from "./pages/TicketDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import UserSettings from './pages/UserSettings';
import TicketChat from "./pages/TicketChat";
import UserLayout from './components/UserLayout';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Protected> <UserLayout> <Dashboard /></UserLayout> </Protected>}/>
          <Route path="/agent-dashboard" element={<Protected> <AgentDashboard /> </Protected>}/>
          <Route path="/account" element={<Protected> <UserLayout> <UserSettings /> </UserLayout> </Protected>}/>
          <Route path="/view-tickets" element={<Protected> <TicketDashboard /> </Protected>}/>
          <Route path="/chat/:ticketId" element={<Protected> <TicketChat /> </Protected>}/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
