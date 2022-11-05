import styled from "styled-components";
import { CONSTANTS } from "../../constants";

export const root = styled("div")({
  display: "grid",
  gridTemplate: `repeat(${CONSTANTS.DIMENSIONS}, 1fr) / repeat(${CONSTANTS.DIMENSIONS}, 1fr)`,
  gap: 8,
  background: "#070e17",
  padding: 8,
  borderRadius: 8,
  position: "relative",
  boxShadow: "0px 8px 20px rgba(0,0,0,0.4)",
});
