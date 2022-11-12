import styled from "styled-components";

const green = "#14cd96";
const bg2 = "#1e232f";

export const root = styled("nav")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 16,
});

export const button = styled("button")({
  borderRadius: 6,
  background: bg2,
  lineHeight: 1,
  padding: "14px 18px",
  color: "#b3b8c2",
  fontSize: 16,
  "&[data-active='true']": {
    background: green,
    color: "white",
  },
  "&[disabled]": {
    cursor: "auto",
  },
});

export const title = styled("div")({
  fontSize: 20,
});
export const content = styled("div")({
  display: "flex",
  columnGap: 16,
});
