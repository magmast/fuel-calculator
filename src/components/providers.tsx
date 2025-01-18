"use client";

import { ReactNode } from "react";
import { LazyMotion } from "motion/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion
      features={() => import("motion/react").then((mod) => mod.domAnimation)}
    >
      {children}
    </LazyMotion>
  );
}
