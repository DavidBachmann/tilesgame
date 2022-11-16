import styled from "styled-components";
import { CONSTANTS } from "../../constants";

export const root = styled("div")<{ gridSize: number }>(({ gridSize }) => ({
  display: "grid",
  gap: `var(--tile-gap, ${CONSTANTS.TILE_GAP_MAX}px)`,
  gridTemplate: `repeat(${gridSize}, 1fr) / repeat(${gridSize}, 1fr)`,
}));
