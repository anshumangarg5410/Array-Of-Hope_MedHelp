import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { simulateAiReply, simulateInteractionCheck, simulatePrescriptionProcessing } from "./mockApi";
import {
  aiSeedMessages,
  defaultHealthProfile,
  doctorSeedMessages,
  extractedMedicines,
  historyTimeline,
  interactions,
  patientList,
  patientPortalMessages,
} from "./mockData";
import { readStorage, storageKeys, writeStorage } from "./storage";
import { api } from "../services/api";

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
      userId: readStorage(storageKeys.userId, null),
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
  const [patientPortalMessagesState, setPatientPortalMessagesState] = useState(() =>
    readStorage(storageKeys.patientPortalChat, patientPortalMessages),
  );
  const [healthProfile, setHealthProfile] = useState(() =>
    readStorage(storageKeys.healthProfile, defaultHealthProfile),
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

  useEffect(() => {
    writeStorage(storageKeys.patientPortalChat, patientPortalMessagesState);
  }, [patientPortalMessagesState]);

  useEffect(() => {
    writeStorage(storageKeys.healthProfile, healthProfile);
  }, [healthProfile]);

  const login = ({ role, name, email, userId }) => {
    writeStorage(storageKeys.userId, userId);
    setSession({
      role,
      name,
      email,
      userId,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    writeStorage(storageKeys.token, null);
    writeStorage(storageKeys.userId, null);
    setSession({
      role: null,
      isAuthenticated: false,
      name: "",
      email: "",
      userId: null,
    });
  };

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  const processUpload = async ({ file, image }) => {
    if (!session.userId) throw new Error("User must be logged in to check prescriptions");
    
    try {
      const result = await api.checkPrescription(session.userId);
      setUploadState({
        image,
        fileName: file?.name || "prescription.pdf",
        extracted: [], // Using demo prescription internally right now
        interactions: result,
        lastCheckedAt: makeTimeLabel(),
      });
      return { interactions: result };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const sendAiMessage = async (message) => {
    const nextUserMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: message,
      time: makeTimeLabel(),
    };

    setAiMessages((current) => [...current, nextUserMessage]);

    try {
      if (!session.userId) throw new Error("Must be logged in to chat");
      
      const result = await api.sendChatMessage(session.userId, message);
      
      const nextAssistantMessage = {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: result.reply,
        time: makeTimeLabel(),
      };

      setAiMessages((current) => [...current, nextAssistantMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setAiMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          sender: "assistant",
          text: "Sorry, I am having trouble connecting to the server right now. Please try again later.",
          time: makeTimeLabel(),
        },
      ]);
    }
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

  const sendPatientPortalMessage = (message, sender = "patient") => {
    const nextMessage = {
      id: crypto.randomUUID(),
      sender,
      text: message,
      time: makeTimeLabel(),
    };

    setPatientPortalMessagesState((current) => [...current, nextMessage]);

    if (sender === "patient") {
      window.setTimeout(() => {
        setPatientPortalMessagesState((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            sender: "doctor",
            text: "I received your update. Please upload the new prescription or add it manually so I can compare the medication list.",
            time: makeTimeLabel(),
          },
        ]);
      }, 1000);
    }
  };

  const addManualPrescription = ({ title, medicines }) => {
    const trimmedMedicines = medicines
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!trimmedMedicines.length) {
      return;
    }

    setHealthProfile((current) => ({
      ...current,
      pastPrescriptions: [
        {
          id: crypto.randomUUID(),
          title: title || "Manual prescription entry",
          date: new Date().toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          items: trimmedMedicines,
        },
        ...current.pastPrescriptions,
      ],
      ongoingMedicines: Array.from(new Set([...trimmedMedicines, ...current.ongoingMedicines])),
    }));
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
      patientPortalMessages: patientPortalMessagesState,
      sendPatientPortalMessage,
      healthProfile,
      addManualPrescription,
      historyTimeline,
      patientList,
    }),
    [theme, session, uploadState, aiMessages, doctorMessages, patientPortalMessagesState, healthProfile],
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
