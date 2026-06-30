import { IoLogOut } from "react-icons/io5";
import { CheckSquare } from "lucide-react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import "./index.css";

const Header = ({ profileName }) => {
    const navigate=useNavigate()
    const hangleLogout=()=>{
        Cookies.remove("jwt_token");
        navigate("/login")
    }

    const getInitials = (name) => {
        if (!name) return "JD";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) return "JD";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 glass-header shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 group cursor-pointer">
          <div className="w-9 h-9 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-xl border border-indigo-100 dark:border-indigo-900/40 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            TaskManager
          </span>
        </div>

        {/* Profile and Logout Actions (Right side) */}
        <div className="flex items-center space-x-4">
          
          {/* User Profile Avatar */}
          <div className="flex items-center p-1 rounded-full border border-transparent transition-all duration-200 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-indigo-500/20">
              {getInitials(profileName)}
            </div>
          </div>

          {/* Logout Button */}
          <button 
            aria-label="Log Out"
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 transition-all duration-250 shadow-sm flex items-center justify-center"
          onClick={hangleLogout}> 
            <IoLogOut size={20} />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;