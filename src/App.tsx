import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingFallback from "@/components/LoadingFallback";

const Index = lazy(() => import("./pages/Index"));
const Home = lazy(() => import("./pages/Home"));
const NotFoundCustom = lazy(() => import("./pages/NotFoundCustom"));
const AdminFix = lazy(() => import("./pages/AdminFix"));
const AnimationShowcase = lazy(() => import("./components/AnimationShowcase"));
const MenuShowcase = lazy(() => import("./components/MenuShowcase"));
const HeaderVariants = lazy(() => import("./components/HeaderVariants"));
const VKCallback = lazy(() => import("./pages/VKCallback"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Marketing = lazy(() => import("./pages/Marketing"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Blog = lazy(() => import("./pages/Blog"));

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

function RoutePreloader() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/blog';
      document.head.appendChild(link);

      const blogPreload = () => import('./pages/Blog');
      const timer = setTimeout(blogPreload, 2000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return null;
}

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <RoutePreloader />
              <Suspense fallback={<LoadingFallback />}>
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
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<Blog />} />
                  <Route path="*" element={<NotFoundCustom />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;