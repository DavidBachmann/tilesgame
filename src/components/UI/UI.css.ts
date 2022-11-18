import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { CONSTANTS } from "../../constants";
import { clampy } from "../../utils";

export const root = styled("div")({
  display: "flex",
  flexDirection: "column",

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

export const navItem = styled(NavLink)({
  lineHeight: 1,
  fontSize: 16,
  color: CONSTANTS.NEW_COLORS.WHITE,
  opacity: 0.7,
  transition: "opacity 200ms",
  "&.active": {
    color: CONSTANTS.NEW_COLORS.SEA_GREEN,
    opacity: 1,
  },
  "&[disabled]": {
    cursor: "auto",
  },
});

export const title = styled("div")({
  fontSize: 20,
  flex: 1,
});

export const content = styled("div")({
  display: "flex",
  alignItems: "center",
  columnGap: 32,
  justifyContent: "center",
  flex: 1,
});

export const os = styled("div")({
  display: "none",
  flex: 1,
  justifyContent: "flex-end",
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
