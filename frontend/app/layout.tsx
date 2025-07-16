import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/contexts/AppContext";
import { InterviewProvider } from "@/contexts/InterviewContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CS Academy - Computer Science & Engineering Hub",
  description:
    "Complete platform for CS students with AI-powered learning, career guidance, and placement preparation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AppProvider>
            <InterviewProvider>{children}</InterviewProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
