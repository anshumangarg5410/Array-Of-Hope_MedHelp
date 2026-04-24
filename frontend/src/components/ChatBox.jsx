import { useState } from "react";
import Button from "./Button";
import Card from "./Card";

export default function ChatBox({
  title,
  subtitle,
  messages,
  onSend,
  placeholder,
  loading = false,
}) {
  const [input, setInput] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    const next = input;
    setInput("");
    await onSend(next);
  };

  return (
    <Card className="flex h-full min-h-[36rem] flex-col p-5">
      <div className="mb-5">
        <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-[2rem] bg-white/50 p-4 dark:bg-white/5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 ${
              message.sender === "user" || message.sender === "patient"
                ? "ml-auto bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "glass-panel"
            }`}
          >
            <p>{message.text}</p>
            <p className="mt-2 text-xs opacity-70">{message.time}</p>
          </div>
        ))}
        {loading ? <div className="h-24 animate-pulse rounded-[1.5rem] bg-white/50 dark:bg-white/5" /> : null}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          className="glass-panel min-h-14 flex-1 rounded-2xl border-0 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          placeholder={placeholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </Card>
  );
}
