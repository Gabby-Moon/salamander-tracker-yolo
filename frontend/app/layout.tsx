import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link"

export const metadata: Metadata = {
  title: "Salamander App",
  description: "An app for processing salamander videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // state and use effect gets set up here?

  return (
    <html lang="en">
      <body>
        <header>
          <nav className="top-nav">
            <Link href="/">Home</Link>
            <Link href="/videos">Videos</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
