import styled from "styled-components";

export const root = styled("footer")({
  position: "absolute",
  left: 32,
  right: 32,
  bottom: 16,
  display: "flex",
  justifyContent: "space-between",
});

export const os = styled("div")({
  display: "flex",
  svg: {
    width: 20,
    height: "auto",
  },
});

export const text = styled("span")({
  color: "rgba(255,255,255,0.8)",
  fontSize: 12,
});
