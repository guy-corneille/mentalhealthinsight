
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the root element and provide clear error if it doesn't exist
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found. Cannot mount React application.");
  throw new Error("Root element not found");
}

// Create a root and render the app
const root = createRoot(rootElement);
root.render(<App />);

console.log("Application rendered to DOM");
