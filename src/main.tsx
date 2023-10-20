import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { GoogleAuthProvider } from "./hooks/useGoogleAuth.hook.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        <Toaster position="top-right" />

        <App />
      </GoogleAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
