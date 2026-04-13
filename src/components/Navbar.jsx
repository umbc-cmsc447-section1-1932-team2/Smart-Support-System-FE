 import Button from "./Buttons";
 import { Link } from "react-router-dom";
 import logo from "../assets/logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";

function Navbar({ user = null }) {
  return (
    <nav className="fixed w-full flex items-center justify-between px-8 py-4 bg-white h-[5em] shadow-sm">
      <div className="flex items-center gap-2">
        <img src={logo} className="h-[4em]" />
        <div className="leading-tight">
          <p className="font-black text-secondary text-sm uppercase">Smart</p>
          <p className="text-[9px] text-gray-400 uppercase font-medium">
            Support System
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <FaRegUserCircle className="text-3xl text-primary" />
            <IoIosNotificationsOutline className="text-3xl text-primary" />
          </>
        ) : (
          <>
            <Button variant="outline" size="medium">
              Login
            </Button>
            
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
