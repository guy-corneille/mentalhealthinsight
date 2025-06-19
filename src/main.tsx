import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <BrowserRouter basename="/mhq">
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </NotificationProvider>
  </QueryClientProvider>
);
