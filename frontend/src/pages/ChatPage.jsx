import { useState } from "react";
import ChatBox from "../components/ChatBox";
import { useAppContext } from "../utils/AppContext";

export default function ChatPage() {
  const { aiMessages, doctorMessages, sendAiMessage, sendDoctorMessage } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleAiSend = async (message) => {
    setLoading(true);
    await sendAiMessage(message);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <ChatBox
        title="AI Health Assistant"
        subtitle="Ask about symptoms, dose timing, and how to interpret the current medication alerts."
        messages={aiMessages}
        onSend={handleAiSend}
        placeholder="Ask about symptoms or medicine timing..."
        loading={loading}
      />
    </div>
  );
}
