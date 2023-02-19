import { ReactNode } from "react";
import "tailwindcss/tailwind.css";

export interface RootLayoutProps {
  children?: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <head />
    <body>{children}</body>
  </html>
);

export default RootLayout;
