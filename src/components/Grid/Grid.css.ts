import styled from "styled-components";
import { CONSTANTS } from "../../constants";

export const root = styled("div")({
  display: "grid",
  gridTemplate: `repeat(${CONSTANTS.DIMENSIONS}, 1fr) / repeat(${CONSTANTS.DIMENSIONS}, 1fr)`,
  gap: 8,
});
