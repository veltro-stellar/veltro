import React from "react";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  themeColor: "#6366f1",
};

export const metadata: Metadata = {
  title: "Veltro - Payment Network Intelligence",
  description:
    "Institutional-grade insights into Stellar payment network performance. Predict success, optimize routing, and monitor liquidity.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Veltro",
  },
  formatDetection: { telephone: false },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") ?? "en";

  return (
    <html lang={locale} className="dark" suppressHydrationWarning style={{ backgroundColor: '#070c18' }}>
      <head>
        {/* Blocking script — sets theme before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('stellar-theme-preference');var t=p==='light'?'light':p==='dark'?'dark':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.remove('dark','light');document.documentElement.classList.add(t);document.documentElement.setAttribute('data-theme',t);if(t==='light'){document.documentElement.style.backgroundColor='#f8fafc';}else{document.documentElement.style.backgroundColor='#070c18';}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="font-sans antialiased text-foreground selection:bg-accent/30"
        suppressHydrationWarning
        style={{ backgroundColor: '#070c18', color: '#e8f4fd' }}
      >
        {children}
      </body>
    </html>
  );
}
