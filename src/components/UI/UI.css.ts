import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { CONSTANTS } from "../../constants";
import { clampy } from "../../utils";

export const root = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 8,

  "--tile-size": clampy(
    CONSTANTS.TILE_SIZE_MIN,
    CONSTANTS.TILE_SIZE_MAX,
    429,
    1440
  ),
  "--tile-gap": clampy(
    CONSTANTS.TILE_GAP_MIN,
    CONSTANTS.TILE_GAP_MAX,
    429,
    1440
  ),
  "--tile-radius": clampy(
    CONSTANTS.TILE_RADIUS_MIN,
    CONSTANTS.TILE_RADIUS_MAX,
    429,
    1440
  ),
});

export const area = styled("div")({
  position: "relative",
  marginTop: 32,
});

export const header = styled("header")({
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
});

export const nav = styled("nav")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 16,
});

export const button = styled(NavLink)({
  borderRadius: 6,
  background: "1e232f",
  lineHeight: 1,
  padding: "14px 18px",
  color: "#b3b8c2",
  fontSize: 16,
  "&.active": {
    background: "#14cd96",
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
  alignItems: "center",
  columnGap: 16,
});

export const os = styled("div")({
  display: "none",
  svg: {
    width: 20,
    height: "auto",
  },

  "@media (min-width: 429px)": {
    display: "flex",
  },
});

export const footer = styled("footer")({
  position: "absolute",
  left: 32,
  right: 32,
  bottom: 16,
  display: "flex",
  justifyContent: "space-between",
});

export const text = styled("span")({
  color: "rgba(255,255,255,0.8)",
  fontSize: 12,
});
