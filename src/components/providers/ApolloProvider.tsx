"use client";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@/contexts/auth-context";
import { useMemo } from "react";

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    });

    const authLink = setContext((_, { headers }) => {
      const authorization = token ? `Bearer ${token}` : "";
      return {
        headers: {
          ...headers,
          authorization,
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
        query: {
          fetchPolicy: "network-only",
          errorPolicy: "all",
        },
        mutate: {
          errorPolicy: "all",
        },
      },
    });
  }, [token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
