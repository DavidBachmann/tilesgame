import styled from "styled-components";

export const root = styled("div")({
  padding: 16,
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  position: "absolute",
  inset: 0,
  zIndex: 1,
});

export const buttons = styled("div")({
  padding: 16,
  rowGap: 16,
  display: "flex",
  flexDirection: "column",
  marginTop: "auto",
  marginBottom: 16,
});

export const title = styled("h2")({
  fontWeight: 500,
  marginBottom: 16,
});

export const subtitle = styled("h3")({
  fontWeight: 300,
  marginBottom: 16,
});

export const content = styled("div")({
  rowGap: 8,
  display: "flex",
  flexDirection: "column",
});

export const instructions = styled("div")({
  padding: 16,
});
