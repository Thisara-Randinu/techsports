import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Roboto } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myofficialdomain.com/warranty"),
  title: "TechSport Warranty Portal",
  description:
    "TechSport warranty and product support portal embedded under the company website.",
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className} style={{ margin: 0, padding: 0 }}>
        <ThemeRegistry>{children}</ThemeRegistry>
        <Analytics />
      </body>
    </html>
  );
}
