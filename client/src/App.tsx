import { EntitiesProvider } from "@/context/entities";
import { Game } from "@/pages/game";
import { Landing } from "@/pages/landing";
import { queryClient } from "@/queries";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme";

function App() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            <EntitiesProvider>
              <Router
                future={{
                  v7_relativeSplatPath: true,
                  v7_startTransition: true,
                }}
              >
                <div className="h-full w-full bg-secondary-100 relative">
                  <img
                    src="/assets/tunnel-background.svg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    aria-hidden="true"
                  />
                  <main
                    className="relative z-10 h-full"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0%, rgba(0, 0, 0, 0.12) 100%)",
                    }}
                  >
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/game/:id" element={<Game />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </Router>
            </EntitiesProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}

export default App;
