import styled from "styled-components";
import { CONSTANTS } from "../../constants";

export const buttonText = styled("span")({
  lineHeight: 1,
  textAlign: "center",
  position: "relative",
  zIndex: 1,
  fontSize: "1.4rem",
  color: "var(--color-text)",
});

export const button = styled("button")({
  background:
    "linear-gradient(to bottom, var(--color-1, #fdd94e), var(--color-2, #f5c703))",
  border: 0,
  borderRadius: `var(--tile-radius, ${CONSTANTS.TILE_RADIUS_MAX})`,
  boxSizing: "content-box",
  cursor: "grab",
  display: "grid",
  fontWeight: 400,
  minHeight: 48,
  padding: "0.6rem 1.2rem",
  placeItems: "center",
  position: "relative",
  transition: "opacity 0.1s",
  "&::before": {
    borderRadius: `var(--tile-radius, ${CONSTANTS.TILE_RADIUS_MAX})`,
    content: "''",
    background:
      "linear-gradient(to bottom, var(--color-2, #f4b404), var(--color-1, #f7cb76))",
    top: 5,
    bottom: 5,
    left: 6,
    right: 6,
    position: "absolute",
    zIndex: 1,
  },
  "&::after": {
    content: "''",
    background: "var(--color-3, #bb8b00)",
    position: "absolute",
    top: 4,
    bottom: -4,
    left: 0,
    right: 0,
    zIndex: -1,
    borderRadius: `var(--tile-radius, ${CONSTANTS.TILE_RADIUS_MAX})`,
  },

  '&[data-type="0"]': {
    // red
    "--color-text": "#fff",
    "--color-1": "#ff877a",
    "--color-2": "#fd3218",
    "--color-3": "#c70500",
  },

  '&[data-type="1"]': {
    // yellow
    "--color-text": "#000",
    "--color-1": "#fdd94e",
    "--color-2": "#f4b404",
    "--color-3": "#bb8b00",
  },
  '&[data-type="2"]': {
    // green
    "--color-text": "#fff",
    "--color-1": "#7ef51c",
    "--color-2": "#5dc903",
    "--color-3": "#59a911",
  },
  '&[data-type="3"]': {
    // light blue
    "--color-text": "#fff",
    "--color-1": "#19f2f1",
    "--color-2": "#1bc2d4",
    "--color-3": "#05a3aa",
  },
  '&[data-type="4"]': {
    // purple
    "--color-text": "#fff",
    "--color-1": "#c4a3f9",
    "--color-2": "#9c6aea",
    "--color-3": "#672de1",
  },
  '&[data-type="5"]': {
    // dark blue
    "--color-text": "#fff",
    "--color-1": "#6baffb",
    "--color-2": "#2b60f3",
    "--color-3": "#214fcd",
  },
  '&[data-type="6"]': {
    // teal
    "--color-text": "#fff",
    "--color-1": "#23c196",
    "--color-2": "#5bd6b4",
    "--color-3": "#50b69a",
  },
});
