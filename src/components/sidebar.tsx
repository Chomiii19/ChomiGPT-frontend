import {
  BotMessageSquare,
  CircleUser,
  LogOut,
  PanelLeftClose,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useChatHistory } from "../context/chatHistoryContext";
import { useEffect, useState } from "react";
import { useAuth } from "../context/userContext";
import axios from "axios";

type Log = {
  title: string;
  createdAt: Date;
  _id: string;
};

function Sidebar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { resetChat } = useChatHistory();
  const [modal, setModal] = useState(false);
  const [login, setLogin] = useState(true);
  const [todayLogs, setTodayLogs] = useState<Log[]>([]);
  const [monthlyLogs, setMonthlyLogs] = useState<Log[]>([]);
  const [olderLogs, setOlderLogs] = useState<Log[]>([]);

  const handleLogout = async () => {
    try {
      await axios.get("https://chomigpt-backend.onrender.com/api/v1/logout", {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchLogs = async () => {
        try {
          const response = await axios.get(
            `https://chomigpt-backend.onrender.com/api/v1/app/chats/${user._id}`,
            { withCredentials: true }
          );

          setTodayLogs(response.data.data.today);
          setMonthlyLogs(response.data.data.thisMonth);
          setOlderLogs(response.data.data.older);
        } catch (error) {
          console.error(error);
        }
      };

      fetchLogs();
    }
  }, [user]);

  return (
    <>
      <nav className="bg-lightBlack fixed h-screen w-56 font-manrope text-zinc-200 p-3.5 flex flex-col justify-between z-50">
        <div className="flex flex-col w-full gap-4 h-full">
          <header className="flex items-center justify-between w-full">
            <div className="w-full flex gap-1 items-center">
              <img src="/assets/icons/chat-bot.png" className="h-6" />
              <h1 className="text-zinc-400 text-lg font-bold">ChomiGPT</h1>
            </div>
            <PanelLeftClose className="text-zinc-400 cursor-pointer" />
          </header>

          <button
            onClick={() => {
              resetChat();
              navigate("/");
            }}
            className="rounded-lg bg-primary flex w-full text-sm  justify-center py-1 font-semibold items-center cursor-pointer"
          >
            <BotMessageSquare className="h-5" /> New Chat
          </button>

          <section className="flex flex-col w-full mt-5 gap-6 h-full">
            {user ? (
              <>
                {" "}
                {todayLogs.length > 0 && (
                  <div className="w-full flex flex-col gap-1 text-xs">
                    <h2 className="px-2">Today</h2>
                    {todayLogs.map((log, i) => (
                      <Link
                        key={i}
                        to={`/chat/${log._id}`}
                        className="text-zinc-400 hover:bg-lighterBlack p-2 rounded-lg transition-colors duration-150 ease-in-out"
                      >
                        {log?.title}
                      </Link>
                    ))}
                  </div>
                )}
                {monthlyLogs.length > 0 && (
                  <div className="w-full flex flex-col gap-1 text-xs">
                    <h2 className="px-2">This Month</h2>
                    {monthlyLogs.map((log, i) => (
                      <Link
                        key={i}
                        to={`/chat/${log._id}`}
                        className="text-zinc-400 hover:bg-lighterBlack p-2 rounded-lg transition-colors duration-150 ease-in-out"
                      >
                        {log?.title}
                      </Link>
                    ))}
                  </div>
                )}
                {olderLogs.length > 0 && (
                  <div className="w-full flex flex-col gap-1 text-xs">
                    <h2 className="px-2">Older</h2>
                    {olderLogs.map((log, i) => (
                      <Link
                        key={i}
                        to={`/chat/${log._id}`}
                        className="text-zinc-400 hover:bg-lighterBlack p-2 rounded-lg transition-colors duration-150 ease-in-out"
                      >
                        {log?.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex justify-center   items-center text-xs text-zinc-500">
                Log in to view chatlogs
              </div>
            )}
          </section>
        </div>

        {user ? (
          <button className="flex items-center justify-between w-full cursor-pointer hover:bg-lighterBlack px-1.5 py-1 transition-colors duration-150 ease-in-out h-auto rounded-lg group">
            <div className="flex items-center gap-1">
              <CircleUser className="h-5" /> {user.username}
            </div>

            <div
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <LogOut className="h-5 hidden group-hover:block text-zinc-400 hover:text-primary transition-colors duration-150 ease-in-out" />
            </div>
          </button>
        ) : (
          <button
            onClick={() => setModal(true)}
            className="flex items-center w-full cursor-pointer gap-1 hover:bg-lighterBlack px-1.5 py-1 transition-colors duration-150 ease-in-out h-auto rounded-lg"
          >
            <CircleUser className="h-5" /> Log In
          </button>
        )}
      </nav>
      {modal && (
        <div
          onClick={() => setModal(false)}
          className="h-screen w-full bg-black/50 fixed z-50 flex justify-center items-center font-manrope text-zinc-200"
        >
          {login ? (
            <Login setLogin={setLogin} setModal={setModal} />
          ) : (
            <Signup setLogin={setLogin} setModal={setModal} />
          )}
        </div>
      )}
    </>
  );
}

function Login({
  setLogin,
  setModal,
}: {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://chomigpt-backend.onrender.com/api/v1/login",
        { username, password },
        { withCredentials: true }
      );
      setModal(false);
      refreshUser();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="bg-lightBlack rounded-xl p-10 px-16 items-center flex flex-col w-[400px] relative"
    >
      <div
        onClick={() => setModal(false)}
        className="absolute top-3 right-3 cursor-pointer hover:bg-lighterBlack rounded-full p-1 transition-colors duration-150 ease-in-out"
      >
        <X />
      </div>
      <img src="/assets/icons/chat-bot.png" className="h-9 w-9 mb-2" />
      <h1 className="font-semibold text-xl mb-3">Log in to your Account</h1>
      <div className="w-full">
        <label htmlFor="username" className="text-sm">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-lighterBlack rounded-lg outline-0 px-2 py-1 border border-transparent transition-colors duration-150 ease-in-out focus:border-primary"
        />
      </div>
      <div className="w-full mt-1 mb-3">
        <label htmlFor="password" className="text-sm">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-lighterBlack rounded-lg outline-0 px-2 py-1 border border-transparent transition-colors duration-150 ease-in-out focus:border-primary"
        />
      </div>
      <button
        type="submit"
        className="bg-primary rounded-lg py-1 w-full cursor-pointer font-bold"
      >
        LOG IN
      </button>
      <div className="flex gap-1 items-center text-xs text-zinc-500 mt-2">
        <p>No account yet?</p>
        <span
          onClick={() => setLogin(false)}
          className="text-primary cursor-pointer"
        >
          Create account
        </span>
      </div>
    </form>
  );
}

function Signup({
  setLogin,
  setModal,
}: {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://chomigpt-backend.onrender.com/api/v1/signup",
        { username, password },
        { withCredentials: true }
      );
      setModal(false);
      refreshUser();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="bg-lightBlack rounded-xl p-10 px-16 items-center flex flex-col w-[400px] relative"
    >
      <div
        onClick={() => setModal(false)}
        className="absolute top-3 right-3 cursor-pointer hover:bg-lighterBlack rounded-full p-1 transition-colors duration-150 ease-in-out"
      >
        <X />
      </div>
      <img src="/assets/icons/chat-bot.png" className="h-9 w-9 mb-2" />
      <h1 className="font-semibold text-xl mb-3">Create an Account</h1>

      <div className="w-full">
        <label htmlFor="username" className="text-sm">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-lighterBlack rounded-lg outline-0 px-2 py-1 border border-transparent transition-colors duration-150 ease-in-out focus:border-primary"
        />
      </div>

      <div className="w-full mt-1 mb-3">
        <label htmlFor="password" className="text-sm">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-lighterBlack rounded-lg outline-0 px-2 py-1 border border-transparent transition-colors duration-150 ease-in-out focus:border-primary"
        />
      </div>

      <button
        type="submit"
        className="bg-primary rounded-lg py-1 w-full cursor-pointer font-bold"
      >
        CREATE ACCOUNT
      </button>

      <div className="flex gap-1 items-center text-xs text-zinc-500 mt-2">
        <p>Already have an account?</p>
        <span
          onClick={() => setLogin(true)}
          className="text-primary cursor-pointer"
        >
          Log in
        </span>
      </div>
    </form>
  );
}

export default Sidebar;
