import { ReactNode } from "react";
import { useConfig } from "../../context/ConfigContext";
import * as css from "./Grid.css";

export const Grid = ({ children }: { children: ReactNode }) => {
  const config = useConfig();
  return <css.root gridSize={config.gridSize}>{children}</css.root>;
};
