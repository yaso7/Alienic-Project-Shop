import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore the sacred collections of The Alienic Project — each altar a testament to dark artistry.",
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
