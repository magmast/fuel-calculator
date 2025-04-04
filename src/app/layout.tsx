import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import { ReactNode, Suspense } from "react";

import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Fuel Price Calculator",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
