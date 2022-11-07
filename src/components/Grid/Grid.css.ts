import styled from "styled-components";

export const root = styled("div")<{ gridSize: number }>(({ gridSize }) => ({
  display: "grid",
  gridTemplate: `repeat(${gridSize}, 1fr) / repeat(${gridSize}, 1fr)`,
  gap: 6,
  background: "rgba(7,14,23,0.6)",
  padding: 12,
  backdropFilter: "blur(16px)",
  borderRadius: 16,
  position: "relative",
  boxShadow: "0px 8px 20px rgba(0,0,0,0.4)",
  overflow: "hidden",
  "&::before": {
    content: "''",
    zIndex: -1,
    position: "absolute",
    background: "transparent",
    borderRadius: "50%",
    right: "0",
    top: "0",
    boxShadow: "0px 0px 100px 200px rgba(255, 255, 255, 0.1)",
  },
}));
