import { ReactNode } from "react";
import { CONSTANTS } from "../../constants";
import { useConfig } from "../../context/ConfigContext";
import * as css from "./Board.css";

export function Board({ children }: { children: ReactNode }) {
  const config = useConfig();
  const size = `calc((var(--tile-size, ${CONSTANTS.TILE_SIZE_MAX}) + var(--tile-gap, ${CONSTANTS.TILE_GAP_MAX})) * ${config.gridSize})`;
  return <css.root style={{ width: size, height: size }}>{children}</css.root>;
}
