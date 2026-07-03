import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SummaryCard from "../SummaryCard";

const Summary = ({ refreshTrigger }) => {
  const [summary, setSummary] = useState([
    { title: "Total", value: 0 },
    { title: "Pending", value: 0 },
    { title: "Completed", value: 0 },
    { title: "Overdue", value: 0 },
  ]);

  const [errormsg, setErrorMsg] = useState("");

  const getSummary = async () => {
    const token = Cookies.get("jwt_token");

    if (!token) return;

    try {
      const res = await fetch("https://todolistgenairz.onrender.com/tasks/summary", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setSummary([
          { title: "Total", value: data.total },
          { title: "Pending", value: data.pending },
          { title: "Completed", value: data.completed },
          { title: "Overdue", value: data.overdue },
        ]);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSummary();
  }, [refreshTrigger]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {summary.map(item => (
        <SummaryCard key={item.title} data={item} />
      ))}
    </div>
  );
};

export default Summary;