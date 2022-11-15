import styled from "styled-components";

export const root = styled("div")({
  boxSizing: "content-box",
  backdropFilter: "blur(16px)",
  background: "rgba(7,14,23,0.6)",
  borderRadius: 16,
  boxShadow: "0px 8px 20px rgba(0,0,0,0.4)",
  overflow: "hidden",
  padding: 12,
  position: "relative",
  "&::before": {
    background: "transparent",
    borderRadius: "50%",
    boxShadow: "0px 0px 100px 200px rgba(255, 255, 255, 0.1)",
    content: "''",
    position: "absolute",
    right: "0",
    top: "0",
    zIndex: -1,
  },
});
