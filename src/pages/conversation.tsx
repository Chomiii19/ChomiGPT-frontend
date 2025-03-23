import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/sidebar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Footer from "../components/footer";
import { useChat } from "../context/chatContext";
import { useAuth } from "../context/userContext";
import { useChatHistory } from "../context/chatHistoryContext";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function Conversation() {
  const { id } = useParams();
  const { user } = useAuth();
  const { prompt, setPrompt } = useChat();
  const { chat, setChat, addMessage } = useChatHistory();
  const [typing, setTyping] = useState(false);

  const handleSubmit = async (message: string) => {
    if (message.trim() === "") return;
    setTyping(true);
    addMessage({ role: "user", message, timestamp: new Date() });

    try {
      const response = await axios.post(
        `https://chomigpt-backend.onrender.com/api/v1/app/chat/${id}`,
        { message },
        { withCredentials: true }
      );

      setTyping(false);
      addMessage({
        role: "bot",
        message: response.data.data.response,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error getting bot response:", error);
      setTyping(false);
      addMessage({
        role: "bot",
        message:
          "I'm sorry, I am having trouble answering right now. Please ask again later.",
        timestamp: new Date(),
      });
    }
  };

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      setChat({
        username: "Guest",
        title: "New Chat",
        chatLogs: [],
        createdAt: new Date(),
      });
    } else {
      const fetchHistory = async () => {
        try {
          const response = await axios.get(
            `https://chomigpt-backend.onrender.com/api/v1/app/chat/${id}`,
            { withCredentials: true }
          );

          setChat(response.data.data);
        } catch (err) {
          console.error("Error fetching chatlog:", err);
        }
      };

      fetchHistory();
    }
  }, [id, user]);

  useEffect(() => {
    if (chat && prompt) {
      handleSubmit(prompt);
      setPrompt("");
    }
  }, [chat, prompt]);

  return (
    <>
      <Sidebar />
      <Main typing={typing} />
      <Chatbar handleSubmit={handleSubmit} />
      <Footer />
    </>
  );
}

function Main({ typing }: { typing: boolean }) {
  return (
    <main className="w-full h-screen bg-backgroundColor pl-[14.75rem] p-3 flex flex-col justify-center items-center font-manrope text-zinc-200 pb-36">
      <div className="items-center flex flex-col gap-7 w-full max-h-full overflow-auto">
        <ChatHeader />
        <ConversationContainer typing={typing} />
      </div>
    </main>
  );
}

function ConversationContainer({ typing }: { typing: boolean }) {
  const { chat } = useChatHistory();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.chatLogs.length]);

  if (!chat) return <section className="min-h-[100px]"></section>;

  return (
    <section className="w-[450px] flex flex-col gap-3 min-h-[100px]">
      {chat?.chatLogs.map((log, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`w-full text-xs flex ${
            log.role === "bot" ? "" : "justify-end"
          }`}
        >
          <span
            className={`rounded-xl whitespace-pre-line ${
              log.role === "user"
                ? "bg-lighterBlack/80 max-w-1/2 p-2"
                : "w-full"
            }`}
          >
            <ReactMarkdown
              components={{
                p: (props) => <p className="mb-2" {...props} />,
                strong: (props) => <strong className="font-bold" {...props} />,
                ul: (props) => <ul className="list-disc pl-5" {...props} />,
                ol: (props) => <ol className="list-decimal pl-5" {...props} />,
                li: (props) => <li className="mb-1" {...props} />,
              }}
            >
              {log.message}
            </ReactMarkdown>
          </span>
        </motion.div>
      ))}
      {typing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.15,
          }}
          className="w-full text-xs flex"
        >
          <i className="text-zinc-500">
            Typing<span className="dots">.</span>
          </i>
        </motion.div>
      )}
      <div ref={bottomRef} />
    </section>
  );
}

function ChatHeader() {
  return (
    <div className="flex flex-col items-center gap-4 w-[450px]">
      <div className="flex items-center gap-2">
        <img src="/assets/icons/chat-bot.png" className="h-9" />
        <h1 className="font-semibold text-lg">Hi, I'm ChomiGPT.</h1>
      </div>
      <p className="text-zinc-400 text-xs">How can i help you today?</p>
    </div>
  );
}

function Chatbar({
  handleSubmit,
}: {
  handleSubmit: (message: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(message);
        setMessage("");
      }}
      className="fixed bottom-0 w-full pl-[14.75rem] p-3 flex justify-center font-manrope text-zinc-200 pb-8"
    >
      <div className="flex flex-col bg-lighterBlack/90 rounded-xl p-3 w-auto">
        <textarea
          name="prompt"
          placeholder="Ask about CCBHS"
          id="prompt"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="resize-none w-[450px] outline-0 text-xs"
        ></textarea>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            onClick={() => {
              handleSubmit(message);
              setMessage("");
            }}
            className={` rounded-full p-1 transition-colors duration-150 ease-in-out ${
              message.length > 0
                ? "bg-primary cursor-pointer"
                : "bg-zinc-200/20"
            }`}
          >
            <ArrowUp
              className={`h-5 w-5 transition-colors duration-150 ease-in-out ${
                message.length > 0 ? "text-zinc-200" : "text-lighterBlack/90"
              }`}
            />
          </button>
        </div>
      </div>
    </form>
  );
}

export default Conversation;
