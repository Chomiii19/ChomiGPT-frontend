import { createContext, useContext, useState, ReactNode } from "react";

type Message = {
  role: "user" | "bot";
  message: string;
  timestamp: Date;
};

type UserMessage = {
  username: string;
  title: string;
  chatLogs: Message[];
  createdAt: Date;
};

type ChatContextType = {
  chat: UserMessage | null;
  addMessage: (msg: Message) => void;
  resetChat: () => void;
  setChat: (chat: UserMessage) => void;
};

const ChatHistoryContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [chat, setChat] = useState<UserMessage | null>(null);

  const addMessage = (msg: Message) => {
    if (!chat) return;

    setChat((prevChat) =>
      prevChat ? { ...prevChat, chatLogs: [...prevChat.chatLogs, msg] } : null
    );
  };

  const resetChat = () => {
    setChat(null);
  };

  return (
    <ChatHistoryContext.Provider
      value={{ chat, addMessage, resetChat, setChat }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  }
  return context;
};
