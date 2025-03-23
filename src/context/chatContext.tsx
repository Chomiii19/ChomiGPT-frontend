import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextType = {
  prompt: string;
  setPrompt: (prompt: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [prompt, setPrompt] = useState("");

  return (
    <ChatContext.Provider value={{ prompt, setPrompt }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
