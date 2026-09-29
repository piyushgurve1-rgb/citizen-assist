import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatWidget from "./components/ChatWidget";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);
  useEffect(() => {
  fetch("http://127.0.0.1:8000/")
    .then((response) => response.json())
    .then((data) => {
      console.log("Backend connected:", data);
    })
    .catch((error) => {
      console.error("Backend connection failed:", error);
    });
  }, []);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [selectedService, setSelectedService] = useState(null);
  const [initialAction, setInitialAction] = useState(null);

  const openChat = (service = null, action = null) => {
    setSelectedService(service);
    setInitialAction(action);
    setIsChatOpen(true);
  };

  return (
    <BrowserRouter>
    {!isOnline && (
  <div className="offline-banner">
    You are offline. Cached service information is still available.
  </div>
)}
      <Navbar
        onOpenChat={() => openChat()}

      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onOpenChat={openChat}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/services"
            element={<Services />}
          />

          <Route
            path="/services/:serviceName"
            element={
              <ServiceDetails
                onAskAssistant={openChat}
              />
            }
          />
        </Routes>
      </main>

      <ChatWidget
  isOpen={isChatOpen}
  setIsOpen={setIsChatOpen}
  selectedLanguage={selectedLanguage}
  setSelectedLanguage={setSelectedLanguage}
  selectedService={selectedService}
  initialAction={initialAction}
/>
    </BrowserRouter>
  );
}

export default App;
