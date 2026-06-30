import { useState } from "react";
import { RotateCw } from "lucide-react";
import "./index.css";

const quotesList = [
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It is not that we have a short time to live, but that we waste it.", author: "Seneca" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "Productivity is never an accident. It is the result of excellence.", author: "Paul J. Meyer" },
  { text: "Amateurs sit and wait for inspiration, the rest of us get up and work.", author: "Stephen King" }
];

const Quotes = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleRefresh = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * quotesList.length);
    } while (nextIndex === quoteIndex && quotesList.length > 1);
    setQuoteIndex(nextIndex);
  };

  const activeQuote = quotesList[quoteIndex];

  return (
    <div className="quotes-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[160px] relative">
      {/* Header and Refresh clicker */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
          Quote of the Day
        </span>
        <button
          onClick={handleRefresh}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center"
          title="Refresh quote"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quote content block */}
      <div className="my-3 flex-1 flex items-center">
        <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold leading-relaxed">
          "{activeQuote.text}"
        </p>
      </div>

      {/* Quote Author */}
      <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
        &mdash; {activeQuote.author}
      </div>
    </div>
  );
};

export default Quotes;
