import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nova OS Web Space",
  description: "A premium AI-native desktop prototype for Nova OS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
