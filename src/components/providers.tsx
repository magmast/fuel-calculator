"use client";

import { LazyMotion } from "motion/react";
import { NuqsAdapter } from "nuqs/adapters/next";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <LazyMotion
        features={() => import("motion/react").then((mod) => mod.domAnimation)}
      >
        {children}
      </LazyMotion>
    </NuqsAdapter>
  );
}
