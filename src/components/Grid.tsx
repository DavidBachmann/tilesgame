import { ReactNode } from "react";
import { CONSTANTS } from "../constants";

export const Grid = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "grid",
      gridTemplate: `repeat(${CONSTANTS.DIMENSIONS}, 1fr) / repeat(${CONSTANTS.DIMENSIONS}, 1fr)`,
    }}
  >
    {children}
  </div>
);

export const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex" }}>{children}</div>
);
