
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { NotificationProvider } from './contexts/NotificationContext';

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NotificationProvider>
  </QueryClientProvider>
);
