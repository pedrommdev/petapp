import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { AppFooter } from "@/components/AppFooter";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Find your cat or dog breed · Cat & Dog Repo",
    template: "%s · Cat & Dog Repo",
  },
  description:
    "A playful encyclopedia of cat and dog breeds. Search and filter by size, energy, shedding, kids, and apartment life.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable}`}>
      <body className="bg-cream font-sans text-ink antialiased">
        <a href="#breed-grid" className="skip-link">
          Skip to breeds
        </a>
        <div className="mx-auto flex min-h-dvh w-full max-w-content flex-col px-4 sm:px-6 lg:px-8">
          {children}
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
