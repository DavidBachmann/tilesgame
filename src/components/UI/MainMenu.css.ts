import styled from "styled-components";

export const root = styled("div")({
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  zIndex: 1,
  maxHeight: "66vh",
  "@media (min-width: 429px)": {
    padding: 16,
    maxHeight: "70vh",
  },
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
  paddding: 16,
  display: "flex",
  flexDirection: "column",
});

export const instructions = styled("div")({
  padding: 16,
});
