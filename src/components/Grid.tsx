import { ReactNode } from "react";

export const Grid = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
);

export const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex" }}>{children}</div>
);
