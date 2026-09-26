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
  return (
    <BrowserRouter>
      <Navbar
  onOpenChat={() => setIsChatOpen(true)}
/>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/services/:serviceName"
            element={<ServiceDetails />}
          />
        </Routes>
      </main>
      <ChatWidget
  isOpen={isChatOpen}
  setIsOpen={setIsChatOpen}
  selectedLanguage={selectedLanguage}
  setSelectedLanguage={setSelectedLanguage}
/>
    </BrowserRouter>
  );
}

export default App;