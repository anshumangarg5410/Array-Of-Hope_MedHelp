import { useState } from "react";
import Button from "./Button";
import Card from "./Card";
import { useAppContext } from "../utils/AppContext";

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { aiMessages, sendAiMessage } = useAppContext();

  const handleSend = async (event) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    const nextMessage = input;
    setInput("");
    setLoading(true);
    await sendAiMessage(nextMessage);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <Card className="mb-4 flex h-[30rem] w-[22rem] flex-col rounded-[2rem] p-4 shadow-glow sm:w-[24rem]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-semibold text-slate-950 dark:text-white">MedHelp Assistant</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quick answers, mock AI support</p>
            </div>
            <button
              className="rounded-full p-2 text-slate-500 transition hover:bg-white/60 dark:hover:bg-white/10"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              x
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto rounded-[1.5rem] bg-white/50 p-3 dark:bg-white/5">
            {aiMessages.slice(-5).map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] rounded-[1.25rem] px-3 py-2 text-sm leading-6 ${
                  message.sender === "user"
                    ? "ml-auto bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "glass-panel"
                }`}
              >
                <p>{message.text}</p>
              </div>
            ))}
            {loading ? <div className="h-16 animate-pulse rounded-[1.25rem] bg-white/60 dark:bg-white/5" /> : null}
          </div>

          <form onSubmit={handleSend} className="mt-3 flex gap-2">
            <input
              className="glass-panel min-h-12 flex-1 rounded-2xl border-0 px-4 text-sm outline-none placeholder:text-slate-400 dark:text-white"
              placeholder="Ask MedHelp..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button type="submit" size="sm">
              Send
            </Button>
          </form>
        </Card>
      ) : null}

      <Button
        className="h-14 w-14 rounded-full p-0 text-lg shadow-glow"
        onClick={() => setOpen((current) => !current)}
        aria-label="Open chatbot"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
          <path
            d="M12 3.5 13.35 8a4 4 0 0 0 2.65 2.65L20.5 12 16 13.35A4 4 0 0 0 13.35 16L12 20.5 10.65 16A4 4 0 0 0 8 13.35L3.5 12 8 10.65A4 4 0 0 0 10.65 8L12 3.5Zm6-1 0.55 1.85a2 2 0 0 0 1.1 1.1L21.5 6l-1.85.55a2 2 0 0 0-1.1 1.1L18 9.5l-.55-1.85a2 2 0 0 0-1.1-1.1L14.5 6l1.85-.55a2 2 0 0 0 1.1-1.1L18 2.5Z"
            fill="currentColor"
          />
        </svg>
      </Button>
    </div>
  );
}
