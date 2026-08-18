"use client";

import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "@zii/types";
import { useEffect, useState } from "react";
import { TenantApiService } from "../services/tenantApi";

export function getClientSubdomain(): string | null {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname.toLowerCase();
  const reservedSubdomains = [
    "www",
    "admin",
    "api",
    "app",
    "localhost",
    "127.0.0.1",
  ];

  // Localhost case (e.g. ziidistro.localhost)
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    if (parts.length > 1 && !reservedSubdomains.includes(parts[0])) {
      return parts[0];
    }
    return null;
  }

  // Production domain case (e.g. ziidistro.ziipos.com)
  const parts = hostname.split(".");
  if (parts.length > 2 && !reservedSubdomains.includes(parts[0])) {
    return parts[0];
  }

  return null;
}

export function useSubdomainTenant() {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    setSubdomain(getClientSubdomain());
  }, []);

  const { data: tenant, isLoading } = useQuery<Tenant | null>({
    queryKey: ["subdomainTenant", subdomain],
    queryFn: async () => {
      if (!subdomain) return null;
      try {
        return await TenantApiService.getBySubdomain(subdomain);
      } catch (error) {
        console.warn(`Subdomain '${subdomain}' not found:`, error);
        return null;
      }
    },
    enabled: !!subdomain,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return {
    subdomain,
    tenant: tenant || null,
    isLoading,
  };
}
