import { ReactNode } from "react";
import * as css from "./Grid.css";

export const Grid = ({ children }: { children: ReactNode }) => (
  <css.root>{children}</css.root>
);
