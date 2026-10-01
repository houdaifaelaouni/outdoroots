import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Chat from "@/pages/Chat";
import { ChatWidget } from "@/components/ChatWidget";
import { LocaleProvider } from "@/hooks/useLocale";

function AppRoutes() {
  const location = useLocation();
  const hiddenWidgetPaths = ["/chat", "/admin"];
  const showWidget = !hiddenWidgetPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      {showWidget && <ChatWidget />}
    </>
  );
}

function App() {
  return (
    <LocaleProvider><div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div></LocaleProvider>
  );
}

export default App;
