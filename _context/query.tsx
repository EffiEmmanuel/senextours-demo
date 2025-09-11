'use client';

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined;

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client.
        staleTime: 60 * 1000,
      },
    },
  });

const getQueryClient = () => {
  if (isServer) {
    // Server: Always make a new query client.
    return makeQueryClient();
  }

  // Browser: Make a new query client if we don't already have one.
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => (
  <QueryClientProvider client={getQueryClient()}>
    {children}
  </QueryClientProvider>
);
