import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Buttons";
import logo from "../assets/logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

const MENU_ITEMS = [
  // { label: "Profile", icon: IoPersonOutline, to: "/profile" },
  { label: "Settings", icon: IoSettingsOutline, to: "/account" },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await apiFetch("/auth/logout", "POST", { accessToken: user.accessToken });
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed w-full flex items-center justify-between px-8 py-4 bg-white h-[5em] shadow-sm z-50">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} className="h-[4em]" />
        <div className="leading-tight">
          <p className="font-black text-secondary text-sm uppercase">Smart</p>
          <p className="text-[9px] text-gray-400 uppercase font-medium">
            Support System
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* <IoIosNotificationsOutline className="text-3xl text-primary cursor-pointer" /> */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-sm font-bold text-gray-700">
                  {user.username}
                </span>
                <FaRegUserCircle className="text-3xl text-primary" />
              </button>

              {open && (
                <div className="absolute right-0 top-[4em] w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                  {MENU_ITEMS.map(({ label, icon: Icon, to }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-offwhite transition-colors"
                    >
                      <Icon className="text-lg text-primary" />
                      {label}
                    </Link>
                  ))}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <IoLogOutOutline className="text-lg" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" size="medium">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="filled" size="medium">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
