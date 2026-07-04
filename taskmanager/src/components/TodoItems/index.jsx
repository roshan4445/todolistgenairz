import { Calendar, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const TodoItems = ({ todo, handleDeleteDash, handleUpdateStatus, handleEditDash }) => {
  if (!todo) return null;

  const { title, description, status, priority, dueDate } = todo;
  const isCompleted = status === "Completed";
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = () => {
    handleDeleteDash(todo._id);
  };

  const handleStatusSelect = (newStatus) => {
    if (handleUpdateStatus) {
      handleUpdateStatus(todo._id, newStatus);
    }
  };

  const handleCheckboxChange = (e) => {
    const newStatus = e.target.checked ? "Completed" : "Todo";
    if (handleUpdateStatus) {
      handleUpdateStatus(todo._id, newStatus);
    }
  };

  const priorityStyles = {
    High: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
    Medium: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
  };

  const statusStyles = {
    Todo: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
    "In Progress": "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30",
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
  };

  const formattedDate = dueDate 
    ? new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "No due date";

  return (
    <div className={`p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
      isCompleted ? "opacity-60" : ""
    }`}>
      {/* Left side details */}
      <div className="flex items-start space-x-4 flex-1 min-w-0">
        <div className="flex items-center h-6 mt-0.5">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxChange}
            className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition cursor-pointer"
          />
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className={`text-base font-semibold leading-tight transition-colors ${
            isCompleted ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-800 dark:text-slate-100"
          }`}>
            {title}
          </h4>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right side actions and tags */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 shrink-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3.5 md:pt-0">
        {/* Due Date */}
        {dueDate && (
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-800/60">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        )}

        {/* Priority Badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${priorityStyles[priority] || priorityStyles.Low}`}>
          {priority}
        </span>

        {/* Interactive Status Badge & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 hover:opacity-90 active:scale-95 ${statusStyles[status] || statusStyles.Todo}`}
          >
            <span>{status}</span>
            <ChevronDown className="w-3 h-3 shrink-0 opacity-70" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-1 origin-top-right transition-all">
              {["Todo", "In Progress", "Completed"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    handleStatusSelect(s);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[10px] font-bold tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                    status === s
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/10"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center space-x-1 pl-2 border-l border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handleEditDash(todo)}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItems;