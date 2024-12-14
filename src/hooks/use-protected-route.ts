"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !token) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, token, router]);

  return !isLoading && isAuthenticated && !!token;
}
