import Navbar from "../components/Navbar";
import Button from "../components/Buttons";

function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7fa] font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-[500px] rounded-[3rem] shadow-2xl p-12 md:p-16 flex flex-col items-center border border-gray-50">
          
          <div className="flex flex-col items-start mb-4">
            <h2 className="text-blue-900 font-black tracking-tighter text-sm uppercase leading-none">Smart</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.0em] font-bold">Support System</p>
          </div>

          <h1 className="text-4xl font-black mb-10 text-gray-900 tracking-tighter">Login</h1>
          
          <div className="h-4"></div>
          
          <div className="w-full space-y-6 text-left">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-600 ml-1">Email</label>
              <input 
                type="email" 
                className="w-full h-14 border-2 border-gray-200 rounded-2xl px-4 focus:outline-none focus:border-blue-500 font-medium" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-600 ml-1">Password</label>
              <input 
                type="password" 
                className="w-full h-14 border-2 border-gray-200 rounded-2xl px-4 focus:outline-none focus:border-blue-500 font-medium" 
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="filled" className="bg-[#1e4db7] px-10 py-3 rounded-2xl font-bold tracking-tight">
                Login
              </Button>
              <a href="#" className="text-blue-600 font-bold text-sm hover:underline tracking-tight">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-primary border-t border-gray-200">
        Project by Team 2
      </footer>
    </div>
  );
}

export default Login;