import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import ArticleDetailPage from "@/pages/article-detail";
import CategoryPage from "@/pages/category";
import AdminDashboard from "@/pages/admin/index";
import ArticleEditor from "@/pages/admin/article-editor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/article/:slug" component={ArticleDetailPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/article/:id" component={ArticleEditor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
