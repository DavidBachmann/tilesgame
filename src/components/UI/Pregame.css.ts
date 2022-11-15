import styled from "styled-components";

export const root = styled("div")({
  padding: 16,
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  rowGap: 48,
  height: "100%",
});

export const buttons = styled("div")({
  rowGap: 16,
  display: "flex",
  flexDirection: "column",
});

export const title = styled("h2")({
  fontWeight: 600,
});

export const subtitle = styled("h3")({
  fontWeight: 500,
});

export const content = styled("div")({
  rowGap: 8,
  display: "flex",
  flexDirection: "column",
});
