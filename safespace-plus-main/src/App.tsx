import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Tools from "./pages/Tools";
import Breathing from "./pages/tools/Breathing";
import Grounding from "./pages/tools/Grounding";
import GratitudeJournal from "./pages/tools/GratitudeJournal";
import FreeJournal from "./pages/tools/FreeJournal";
import VoiceVent from "./pages/tools/VoiceVent";
import ThoughtReframing from "./pages/tools/ThoughtReframing";
import WorryJournal from "./pages/tools/WorryJournal";
import TEBAnalyzer from "./pages/tools/TEBAnalyzer";
import CopingStrategies from "./pages/tools/CopingStrategies";
import Crisis from "./pages/Crisis";
import MoodHistory from "./pages/MoodHistory";
import Settings from "./pages/Settings";
import TrustedContacts from "./pages/TrustedContacts";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/breathing" element={<Breathing />} />
            <Route path="/tools/grounding" element={<Grounding />} />
            <Route path="/tools/gratitude" element={<GratitudeJournal />} />
            <Route path="/tools/journal" element={<FreeJournal />} />
            <Route path="/tools/voice-vent" element={<VoiceVent />} />
            <Route path="/tools/thought-reframing" element={<ThoughtReframing />} />
            <Route path="/tools/worry-journal" element={<WorryJournal />} />
            <Route path="/tools/teb-analyzer" element={<TEBAnalyzer />} />
            <Route path="/tools/coping-strategies" element={<CopingStrategies />} />
            <Route path="/crisis" element={<Crisis />} />
            <Route path="/mood-history" element={<MoodHistory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/trusted-contacts" element={<TrustedContacts />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
