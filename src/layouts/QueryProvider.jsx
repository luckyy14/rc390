import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 60,
      retry: 1,
    },
  },
});

export const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
