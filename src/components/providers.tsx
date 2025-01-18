"use client";

import { LazyMotion } from "motion/react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion
      features={() => import("motion/react").then((mod) => mod.domAnimation)}
    >
      {children}
    </LazyMotion>
  );
}
