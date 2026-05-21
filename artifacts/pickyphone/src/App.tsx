import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Compare from "@/pages/compare";
import Preferences from "@/pages/preferences";
import Results from "@/pages/results";
import Browse from "@/pages/browse";
import PhoneDetail from "@/pages/phone-detail";
import Analyze from "@/pages/analyze";

const queryClient = new QueryClient();

function Router() {
  return <><ScrollToTop /><Switch><Route path="/" component={Home} /><Route path="/compare" component={Compare} /><Route path="/preferences" component={Preferences} /><Route path="/results" component={Results} /><Route path="/browse" component={Browse} /><Route path="/phones/:id" component={PhoneDetail} /><Route path="/phone/:id" component={PhoneDetail} /><Route path="/analyze/:id" component={Analyze} /><Route component={NotFound} /></Switch></>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ComparisonProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </ComparisonProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
