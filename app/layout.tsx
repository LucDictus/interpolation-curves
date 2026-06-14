import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/layout/Navigation";
import PageTransition from "./components/layout/PageTransition";

export const metadata: Metadata = {
  title: "Interpolation Curves Lab",
  description: "Interactive simulation playground",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Navigation />
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  );
}
