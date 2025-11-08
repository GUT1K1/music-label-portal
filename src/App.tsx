
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFoundCustom from "./pages/NotFoundCustom";
import AdminFix from "./pages/AdminFix";
import AnimationShowcase from "./components/AnimationShowcase";
import MenuShowcase from "./components/MenuShowcase";
import HeaderVariants from "./components/HeaderVariants";
import VKCallback from "./pages/VKCallback";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Marketing from "./pages/Marketing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/app" element={<Index />} />
              <Route path="/vk-callback" element={<VKCallback />} />
              <Route path="/vk-callback.html" element={<VKCallback />} />
              <Route path="/animations" element={<AnimationShowcase />} />
              <Route path="/menus" element={<MenuShowcase />} />
              <Route path="/header-variants" element={<HeaderVariants />} />
              <Route path="/admin-fix-passwords" element={<AdminFix />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/marketing" element={<Marketing />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFoundCustom />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;