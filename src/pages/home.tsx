import { ArrowUp } from "lucide-react";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/chatContext";
import { useAuth } from "../context/userContext";

function Home() {
  return (
    <>
      <Sidebar />
      <Main />
      <Footer />
    </>
  );
}

function Main() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { prompt, setPrompt } = useChat();

  const handleSubmit = async () => {
    try {
      if (!user) {
        navigate(`/chat/${String(Date.now())}`);
        return;
      }

      const response = await axios.post(
        "https://chomigpt-backend.onrender.com/api/v1/app/new-chat",
        { message: prompt },
        { withCredentials: true }
      );

      navigate(`/chat/${response.data.data?._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="w-full h-screen bg-backgroundColor pl-[14.75rem] p-3 flex flex-col justify-center items-center font-manrope text-zinc-200">
      <div className="flex gap-2 items-center mb-4">
        <img src="/assets/icons/chat-bot.png" className="h-9" />
        <h1 className="font-semibold text-lg">Hi, I'm ChomiGPT.</h1>
      </div>
      <p className="text-zinc-400 text-xs">How can i help you today?</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-5"
      >
        <div className="flex flex-col bg-lighterBlack/90 rounded-xl p-3">
          <textarea
            name="prompt"
            placeholder="Ask about CCBHS"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="resize-none w-[450px]  outline-0 text-xs"
          ></textarea>
          <div className="flex w-full justify-end">
            <button
              type="submit"
              className={` rounded-full p-1 transition-colors duration-150 ease-in-out ${
                prompt.length > 0
                  ? "bg-primary cursor-pointer"
                  : "bg-zinc-200/20"
              }`}
            >
              <ArrowUp
                className={`h-5 w-5 transition-colors duration-150 ease-in-out ${
                  prompt.length > 0 ? "text-zinc-200" : "text-lighterBlack/90"
                }`}
              />
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default Home;
