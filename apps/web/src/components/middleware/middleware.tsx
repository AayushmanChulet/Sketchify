"use client"

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Middleware({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("authorization");

    if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/canvas"))) {
      router.replace("/signin");
    }

    if (token && (pathname.startsWith("/signin") || pathname.startsWith("/signup"))) {
      router.replace("/dashboard");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
