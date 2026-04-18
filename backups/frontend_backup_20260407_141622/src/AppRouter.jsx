import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import App from "./App";
import ChatPage from "./pages/ChatPage";

const ALL_AIS = [
  "Velora",
  "Orin",
  "Lyra",
  "Cortex",
  "Sera",
  "Nexa",
  "Forge",
  "Astra",
  "Titan",
];

function SingleAIChatWrapper() {
  const { name } = useParams();
  const normalized = name?.trim();
  const active = ALL_AIS.includes(normalized) ? [normalized] : [];
  return <ChatPage activeAIs={active} />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />} />

        <Route path="/ai/:name" element={<SingleAIChatWrapper />} />

        <Route
          path="/ai/unified"
          element={<ChatPage activeAIs={ALL_AIS} />}
        />

        <Route path="/apikey" element={<ApiKeyPage />} />\n    </Routes>
    </BrowserRouter>
  );
}
import ApiKeyPage from "./pages/ApiKeyPage";
