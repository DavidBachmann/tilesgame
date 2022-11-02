import { ReactNode } from "react";

export const Grid = ({ children }: { children: ReactNode }) => (
  <div
    style={{ display: "grid", gridTemplate: "repeat(6, 1fr) / repeat(6, 1fr)" }}
  >
    {children}
  </div>
);

export const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex" }}>{children}</div>
);
