import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      <main className="pt-28 px-8">
        <p className="text-gray-500 mt-1">{user?.role} dashboard</p>
        <h1 className="text-2xl font-black text-gray-900">
          Welcome back, {user?.username}
        </h1>
      </main>
    </div>
  );
}

export default Dashboard;
