import { ReactNode } from "react";
import { CONSTANTS } from "../../constants";
import { useConfig } from "../../context/ConfigContext";
import * as css from "./Board.css";

export function Board({ children }: { children: ReactNode }) {
  const config = useConfig();
  const size = (CONSTANTS.TILE_SIZE + CONSTANTS.TILE_GAP) * config.gridSize;
  return <css.root style={{ width: size, height: size }}>{children}</css.root>;
}
