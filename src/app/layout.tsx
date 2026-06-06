import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chandni Poddar — Full Stack Developer",
    template: "%s | Chandni Poddar",
  },
  description:
    "Full Stack Developer specializing in Next.js, React, Flutter, and AI/ML. Building elegant, scalable digital experiences.",
  keywords: ["Full Stack Developer", "Next.js", "React", "Flutter", "AI/ML", "Portfolio", "Chandni Poddar"],
  authors: [{ name: "Chandni Poddar" }],
  openGraph: {
    title: "Chandni Poddar — Full Stack Developer",
    description: "Full Stack Developer specializing in Next.js, React, Flutter, and AI/ML.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chandni Poddar — Full Stack Developer",
    description: "Full Stack Developer specializing in Next.js, React, Flutter, and AI/ML.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable} font-inter bg-background text-text antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111827",
                border: "1px solid #1F2937",
                color: "#F9FAFB",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
