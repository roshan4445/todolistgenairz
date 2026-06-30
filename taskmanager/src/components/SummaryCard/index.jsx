import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

const iconMap = {
  Total: {
    icon: ClipboardList,
    bgClass: "bg-blue-50/60 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400",
    label: "Total Tasks"
  },
  Pending: {
    icon: Clock,
    bgClass: "bg-amber-50/60 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400",
    label: "Pending Tasks"
  },
  Completed: {
    icon: CheckCircle2,
    bgClass: "bg-emerald-50/60 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    label: "Completed Tasks"
  },
  Overdue: {
    icon: AlertTriangle,
    bgClass: "bg-rose-50/60 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400",
    label: "Overdue Tasks"
  }
};

const SummaryCard = ({ data }) => {
  const config = iconMap[data.title] || iconMap.Total;
  const IconComponent = config.icon;

  return (
    <div className={`flex flex-col justify-between p-5 border rounded-2xl h-28 shadow-sm transition-all duration-200 hover:shadow-md ${config.bgClass}`}>
      {/* Icon top-left */}
      <div className="flex items-center justify-start">
        <IconComponent className="w-5 h-5 opacity-90" />
      </div>
      
      {/* Text count details */}
      <div>
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 leading-none">
          {data.value}
        </h3>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
          {config.label}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
