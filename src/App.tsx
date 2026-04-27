import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteContext from "@/context/SiteContext";
import { SiteContentProvider } from "@/context/SiteContent";
import Index from "./pages/Index.tsx";
import Admin from "./pages/Admin.tsx";
import TherapistDetail from "./pages/TherapistDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const zugloConfig = {
  key: "zuglo" as const,
  apiBase: "/api",
  basePath: "/",
  therapistRoute: "/szakemberek",
};

const App = () => (
  <SiteContext.Provider value={zugloConfig}>
    <SiteContentProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/szakemberek/:slug" element={<TherapistDetail />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SiteContentProvider>
  </SiteContext.Provider>
);

export default App;
