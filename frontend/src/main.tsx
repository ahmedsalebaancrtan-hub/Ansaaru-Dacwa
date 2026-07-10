import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import App from "./App";

import "./index.css";
import { AuthProvider } from "./context/AuthProvider";

// Controls API request caching and mutation state.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement =
  document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element was not found",
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,

              style: {
                borderRadius: "12px",
                padding: "14px 16px",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);