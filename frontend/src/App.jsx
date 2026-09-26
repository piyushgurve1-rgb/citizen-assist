import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import ChatWidget from "./components/ChatWidget";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [selectedService, setSelectedService] = useState(null);

  const openChat = (service = null, action = null) => {
  setSelectedService(service);
  setIsChatOpen(true);
};

  return (
    <BrowserRouter>
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
      />
    </BrowserRouter>
  );
}

export default App;