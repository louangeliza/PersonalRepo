import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liza.dev | Personal Blog",
  description:
    "A personal blog and developer portfolio built with Next.js, React, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
