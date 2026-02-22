"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/admin-login")

  return (
    <>
      {!isAdminRoute && <Navigation />}
      <main className={!isAdminRoute ? "site-font" : ""}>{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  )
}
