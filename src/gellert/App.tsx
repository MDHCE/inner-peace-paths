import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteContext from "@/context/SiteContext";
import Index from "./pages/Index";
import Admin from "@/pages/Admin";
import TherapistDetail from "@/pages/TherapistDetail";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const gellertConfig = {
  key: "gellert" as const,
  apiBase: "/api/gellert",
  basePath: "/gellert",
  therapistRoute: "/gellert/szakemberek",
};

const App = () => (
  <SiteContext.Provider value={gellertConfig}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/gellert">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/szakemberek/:slug" element={<TherapistDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SiteContext.Provider>
);

export default App;
