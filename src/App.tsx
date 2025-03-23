import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Conversation from "./pages/conversation";
import { ChatProvider } from "./context/chatContext";
import { AuthProvider } from "./context/userContext";
import { ChatHistoryProvider } from "./context/chatHistoryContext";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ChatHistoryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat/:id" element={<Conversation />} />
            </Routes>
          </BrowserRouter>
        </ChatHistoryProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
