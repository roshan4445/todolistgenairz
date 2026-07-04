import { Search, Plus, ChevronDown, X, ClipboardCheck } from "lucide-react";
import Header from "../Header"
import Quotes from "../Quotes"
import Summary from "../Summary";
import TodoItems from "../TodoItems";
import AiSummary from "../AiSummary";
import { useState, useEffect, useRef } from "react"
import Cookies from "js-cookie"

// A premium, fully styleable custom dropdown menu component (flat colors, no glassmorphism)
const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full sm:w-36" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-sm hover:bg-slate-55 dark:hover:bg-slate-800/50"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md z-50 py-1 origin-top">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange({ target: { value: opt.value } });
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/55 transition-colors ${
                value === opt.value 
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/20 dark:bg-indigo-950/10' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
    const [tasks, settasks] = useState([])
    const [search, setsearch] = useState("")
    const [Priority, setPriority] = useState("")
    const [Status, setStatus] = useState("")
    
    // Add Task Modal UI state only
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [editingTask, setEditingTask] = useState(null)
    const [profileName, setProfileName] = useState("")

    // Form inputs state
    const [taskTitle, setTaskTitle] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [taskStatus, setTaskStatus] = useState("Todo")
    const [taskPriority, setTaskPriority] = useState("Medium")
    const [taskDueDate, setTaskDueDate] = useState("")
    const [taskNotes, setTaskNotes] = useState("")

    // Time-based greeting helper
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const handleSearch = (e) => {
        console.log(e.target.value)
        setsearch(e.target.value)
    }
    const handlepriority = (e) => {
        console.log(e.target.value)
        setPriority(e.target.value)
    }
    const handlestatus = (e) => {
        console.log(e.target.value)
        setStatus(e.target.value)
    }
    const handleDeleteDash=async (id)=>{
        console.log(id)
        const token=Cookies.get("jwt_token")
        const res=await fetch(`https://todolistgenairz.onrender.com/tasks/${id}`,{
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${token}`
            }
        })
        const data=await res.json()
        console.log(data)
         if (res.ok) {
                gettingtasks();
                setRefreshKey(prev => prev + 1);
         }
    }

    const handleUpdateStatus = async (id, newStatus) => {
        const token = Cookies.get("jwt_token")
        try {
            const res = await fetch(`https://todolistgenairz.onrender.com/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                gettingtasks();
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const gettingtasks = async () => {
        const token = Cookies.get("jwt_token")
        console.log(token)  
        const options = {
            "headers": {
                "Authorization": `Bearer ${token}`
            }
        }

        const params = new URLSearchParams();

        // Search
        if (search.trim() !== "") {
            params.append("search", search.trim());
        }

        // Status
        if (Status !== "") {
            params.append("status", Status);
        }

        // Priority
        if (Priority !== "") {
            params.append("priority", Priority);
        }

        // Construct URL
        const queryString = params.toString();

        const url = queryString
            ? `https://todolistgenairz.onrender.com/tasks?${queryString}`
            : "https://todolistgenairz.onrender.com/tasks";

        try {
            const res = await fetch(url, options)
            const data = await res.json()
            settasks(data.tasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    const handletasksubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get("jwt_token")
        const url = editingTask 
            ? `https://todolistgenairz.onrender.com/tasks/${editingTask._id}`
            : "https://todolistgenairz.onrender.com/tasks";
        const method = editingTask ? "PUT" : "POST";
        const options = {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: taskTitle,
                description: taskDescription,
                status: taskStatus,
                priority: taskPriority,
                dueDate: taskDueDate,
                notes: taskNotes
            })
        }
        try {
            const res = await fetch(url, options)
            const data = await res.json()
            if (res.ok) {
                gettingtasks();
                setRefreshKey(prev => prev + 1);
                setTaskTitle("");
                setTaskDescription("");
                setTaskStatus("Todo");
                setTaskPriority("Medium");
                setTaskDueDate("");
                setTaskNotes("");
                setEditingTask(null);
                setIsModalOpen(false);
            } else {
                alert(data.message || "Failed to save task");
            }
        } catch (error) {
            console.error("Error saving task:", error);
            alert("Error saving task. Please try again.");
        }
    }

    const handleEditDash = (task) => {
        setEditingTask(task);
        setTaskTitle(task.title || "");
        setTaskDescription(task.description || "");
        setTaskStatus(task.status || "Todo");
        setTaskPriority(task.priority || "Medium");
        setTaskNotes(task.notes || "");
        const dateVal = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "";
        setTaskDueDate(dateVal);
        setIsModalOpen(true);
    }

    useEffect(() => {
        gettingtasks();
    }, [search, Status, Priority])

    const getProfile = async () => {
        const token = Cookies.get("jwt_token")
        const options = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        try {
            const res = await fetch("https://todolistgenairz.onrender.com/profile", options)
            const data = await res.json()
            if (res.ok && data.user) {
                setProfileName(data.user.name);
            }
        } catch (error) {
            console.error("Error fetching profile details:", error);
        }
    }

    useEffect(() => {
        getProfile();
    }, [])


    const statusOptions = [
      { value: "", label: "All Status" },
      { value: "Todo", label: "Todo" },
      { value: "In Progress", label: "In Progress" },
      { value: "Completed", label: "Completed" }
    ];

    const priorityOptions = [
      { value: "", label: "All Priorities" },
      { value: "High", label: "High" },
      { value: "Medium", label: "Medium" },
      { value: "Low", label: "Low" }
    ];

    return (
        <div className="min-h-screen bg-slate-55 text-slate-800 transition-colors duration-300">
            <Header profileName={profileName} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-6 sm:gap-10">
                {/* Greeting section */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                        {getGreeting()}, {profileName || "User"} 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Let's make today productive.
                    </p>
                </div>

                {/* Statistics panel */}
                <Summary key={refreshKey} />

                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
                    
                    {/* Main Content Area */}
                    <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm min-h-[400px]">
                        <h2 className="text-lg font-bold text-slate-900 mb-5">Tasks Checklist</h2>

                        {/* Search and Filters Toolbar in a Single Row */}
                        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mt-4 p-4 bg-slate-55/70 border border-slate-200/60 rounded-xl">
                            <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">

                                {/* Search field */}
                                <div className="relative w-full sm:w-60">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                        <Search className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                        value={search}
                                        onChange={handleSearch}
                                    />
                                </div>

                                {/* Custom Status Selector */}
                                <CustomDropdown 
                                  value={Status} 
                                  onChange={handlestatus} 
                                  options={statusOptions} 
                                  placeholder="All Status" 
                                />

                                {/* Custom Priority Selector */}
                                <CustomDropdown 
                                  value={Priority} 
                                  onChange={handlepriority} 
                                  options={priorityOptions} 
                                  placeholder="All Priorities" 
                                />
                            </div>

                            {/* Add Task Button */}
                            <button 
                              type="button"
                              onClick={() => {
                                  setEditingTask(null);
                                  setTaskTitle("");
                                  setTaskDescription("");
                                  setTaskStatus("Todo");
                                  setTaskPriority("Medium");
                                  setTaskDueDate("");
                                  setTaskNotes("");
                                  setIsModalOpen(true);
                              }}
                              className="w-full md:w-auto px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Task</span>
                            </button>
                        </div>

                        {/* Task items list container */}
                        <div className="mt-6 sm:mt-8 space-y-4">
                            {tasks && tasks.length > 0 ? (
                                tasks.map((item) => (
                                    <TodoItems 
                                        todo={item} 
                                        key={item._id}
                                        handleDeleteDash={handleDeleteDash}
                                        handleUpdateStatus={handleUpdateStatus}
                                        handleEditDash={handleEditDash}
                                        refreshKey={refreshKey}
                                    />
                                ))
                            ) : (
                                // Beautiful minimal empty state
                                <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4.5">
                                        <ClipboardCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-extrabold text-slate-800 text-base leading-none">You're all caught up!</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-2 max-w-xs leading-relaxed">
                                        Create your first task to get started.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar widgets */}
                    <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                        <AiSummary key={`ai-${refreshKey}`} />
                        <Quotes />
                    </div>
                </div>

            </main>

            {/* Premium Add Task Modal Dialog UI (Static Form Template) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-slide-down origin-center">
                        
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => {
                                setTaskTitle("");
                                setTaskDescription("");
                                setTaskStatus("Todo");
                                setTaskPriority("Medium");
                                setTaskDueDate("");
                                setTaskNotes("");
                                setEditingTask(null);
                                setIsModalOpen(false);
                            }}
                            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="font-bold text-slate-800 text-lg mb-1.5">{editingTask ? "Edit Task" : "Add New Task"}</h3>
                        <p className="text-xs text-slate-400 mb-5">{editingTask ? "Modify the task details below." : "Create a task to structure your workspace workflow."}</p>

                        <form className="space-y-4" onSubmit={handletasksubmit}>
                            {/* Task Title */}
                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Task Title</label>
                                <input
                                    type="text"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    required
                                    placeholder="e.g. Design review checklist"
                                    className="w-full px-3.5 py-2 text-sm bg-slate-55 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                />
                            </div>

                            {/* Task Description */}
                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    required
                                    placeholder="Provide detailed context..."
                                    rows={3}
                                    className="w-full px-3.5 py-2 text-sm bg-slate-55 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none"
                                />
                            </div>

                            {/* Task Notes */}
                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Notes (Optional)</label>
                                <textarea
                                    value={taskNotes}
                                    onChange={(e) => setTaskNotes(e.target.value)}
                                    placeholder="Add any extra notes or thoughts..."
                                    rows={2}
                                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none"
                                />
                            </div>

                            {/* Dropdowns row */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Status select */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                                    <select
                                        value={taskStatus}
                                        onChange={(e) => setTaskStatus(e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-755 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                                    >
                                        <option value="Todo">Todo</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                                    <select
                                        value={taskPriority}
                                        onChange={(e) => setTaskPriority(e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-755 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
                                <input
                                    type="date"
                                    value={taskDueDate}
                                    onChange={(e) => setTaskDueDate(e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="flex items-center justify-end space-x-3.5 mt-8 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTaskTitle("");
                                        setTaskDescription("");
                                        setTaskStatus("Todo");
                                        setTaskPriority("Medium");
                                        setTaskDueDate("");
                                        setTaskNotes("");
                                        setEditingTask(null);
                                        setIsModalOpen(false);
                                    }}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all"
                                >
                                    {editingTask ? "Save Changes" : "Save Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;