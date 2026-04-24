import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { simulateAiReply, simulateInteractionCheck, simulatePrescriptionProcessing } from "./mockApi";
import {
  aiSeedMessages,
  doctorSeedMessages,
  extractedMedicines,
  historyTimeline,
  interactions,
  patientList,
} from "./mockData";
import { readStorage, storageKeys, writeStorage } from "./storage";

const AppContext = createContext(null);

function makeTimeLabel() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => readStorage(storageKeys.theme, "light"));
  const [session, setSession] = useState(() =>
    readStorage(storageKeys.session, {
      role: null,
      isAuthenticated: false,
      name: "",
      email: "",
    }),
  );
  const [uploadState, setUploadState] = useState(() =>
    readStorage(storageKeys.upload, {
      image: "",
      fileName: "",
      extracted: extractedMedicines,
      interactions,
      lastCheckedAt: "Today, 11:20 AM",
    }),
  );
  const [aiMessages, setAiMessages] = useState(() => readStorage(storageKeys.aiChat, aiSeedMessages));
  const [doctorMessages, setDoctorMessages] = useState(() =>
    readStorage(storageKeys.doctorChat, doctorSeedMessages),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    writeStorage(storageKeys.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeStorage(storageKeys.session, session);
  }, [session]);

  useEffect(() => {
    writeStorage(storageKeys.upload, uploadState);
  }, [uploadState]);

  useEffect(() => {
    writeStorage(storageKeys.aiChat, aiMessages);
  }, [aiMessages]);

  useEffect(() => {
    writeStorage(storageKeys.doctorChat, doctorMessages);
  }, [doctorMessages]);

  const login = ({ role, name, email }) => {
    setSession({
      role,
      name: name || (role === "doctor" ? "Dr. Alex Morgan" : "Ria Patel"),
      email,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setSession({
      role: null,
      isAuthenticated: false,
      name: "",
      email: "",
    });
  };

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  const processUpload = async ({ file, image }) => {
    const extracted = await simulatePrescriptionProcessing(file);
    const checkedInteractions = await simulateInteractionCheck(extracted);

    setUploadState({
      image,
      fileName: file?.name || "prescription.png",
      extracted,
      interactions: checkedInteractions,
      lastCheckedAt: makeTimeLabel(),
    });

    return {
      extracted,
      interactions: checkedInteractions,
    };
  };

  const sendAiMessage = async (message) => {
    const nextUserMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: message,
      time: makeTimeLabel(),
    };

    setAiMessages((current) => [...current, nextUserMessage]);

    const reply = await simulateAiReply(message);
    const nextAssistantMessage = {
      id: crypto.randomUUID(),
      sender: "assistant",
      text: reply,
      time: makeTimeLabel(),
    };

    setAiMessages((current) => [...current, nextAssistantMessage]);
  };

  const sendDoctorMessage = (message, sender = "patient") => {
    const nextMessage = {
      id: crypto.randomUUID(),
      sender,
      text: message,
      time: makeTimeLabel(),
    };

    setDoctorMessages((current) => [...current, nextMessage]);

    if (sender === "patient") {
      window.setTimeout(() => {
        setDoctorMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            sender: "doctor",
            text: "Thanks for the update. Keep following the adjusted plan and reach out if the symptoms escalate.",
            time: makeTimeLabel(),
          },
        ]);
      }, 1000);
    }
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      session,
      login,
      logout,
      uploadState,
      processUpload,
      aiMessages,
      sendAiMessage,
      doctorMessages,
      sendDoctorMessage,
      historyTimeline,
      patientList,
    }),
    [theme, session, uploadState, aiMessages, doctorMessages],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
