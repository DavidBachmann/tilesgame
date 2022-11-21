import { ReactNode } from "react";
import { CONSTANTS } from "../../constants";
import { useConfig } from "../../context/ConfigContext";
import * as css from "./Board.css";

export function Board({
  children,
  scroll = false,
}: {
  children: ReactNode;
  scroll: boolean;
}) {
  const config = useConfig();
  const size = `calc((var(--tile-size, ${CONSTANTS.TILE_SIZE_MAX}) + var(--tile-gap, ${CONSTANTS.TILE_GAP_MAX})) * ${config.gridSize})`;
  return (
    <css.root
      style={{
        minWidth: size,
        minHeight: size,
        overflow: scroll ? "auto" : "hidden",
      }}
    >
      {children}
    </css.root>
  );
}
