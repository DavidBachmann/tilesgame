import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { CONSTANTS } from "../../constants";

const base = {
  alignItems: "center",
  border: "1px solid transparent",
  borderRadius: 10,
  color: "white",
  display: "flex",
  fontSize: "1.2rem",
  fontWeight: 500,
  justifyContent: "center",
  letterSpacing: "0.015em",
};

type ButtonColorScheme = "white" | "dark";
type ButtonSpacings = "normal" | "small";

const colors = (colorScheme?: ButtonColorScheme) => {
  switch (colorScheme) {
    case "white": {
      return {
        background: "#fff",
        color: "#5194f8",
        shadow: "#b3bbcd",
        border: "#c1c1c2",
      };
    }
    default: {
      return {
        background: `linear-gradient(45deg, ${CONSTANTS.NEW_COLORS.BLUE2}, ${CONSTANTS.NEW_COLORS.PURPLE})`,
        color: "#fff",
        shadow: `linear-gradient(45deg, ${CONSTANTS.NEW_COLORS.BLUE2}, ${CONSTANTS.NEW_COLORS.PURPLE})`,
        border: "#2063c8",
      };
    }
  }
};

const spacings = (spacing?: ButtonSpacings) => {
  switch (spacing) {
    case "normal": {
      return "1rem 1.5rem";
    }
    case "small": {
      return "0.75rem 1.5rem";
    }
    default: {
      return "1rem 1.5rem";
    }
  }
};

export const navButton = styled(NavLink)<{
  colorScheme?: ButtonColorScheme;
  spacing?: ButtonSpacings;
}>(({ colorScheme, spacing }) => {
  const c = colors(colorScheme);
  const s = spacings(spacing);

  return {
    ...base,
    background: c.background,
    borderColor: c.border,
    color: c.color,
    padding: s,
    position: "relative",
    textAlign: "center",

    "&::before": {
      content: "''",
      position: "absolute",
      inset: "2px 0 -4px 0",
      background: c.shadow,
      zIndex: -1,
      borderRadius: "inherit",
    },
  };
});

export const button = styled("button")<{
  colorScheme?: ButtonColorScheme;
  spacing?: ButtonSpacings;
}>(({ colorScheme, spacing }) => {
  const c = colors(colorScheme);
  const s = spacings(spacing);

  return {
    ...base,
    background: c.background,
    borderColor: c.border,
    color: c.color,
    padding: s,
    position: "relative",
    textAlign: "center",

    "&::before": {
      background: c.shadow,
      borderRadius: "inherit",
      content: "''",
      inset: "2px 0 -4px 0",
      position: "absolute",
      zIndex: -1,
    },
  };
});

export const buttonText = styled("span")({
  lineHeight: 1,
  textAlign: "center",
});
