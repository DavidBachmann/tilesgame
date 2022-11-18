import { ReactNode } from "react";
import * as css from "./Button.css";

type ButtonBaseProps = {
  children: ReactNode;
  colorScheme?: "white" | "dark";
  spacing?: "small" | "normal";
};

type ButtonProps = ButtonBaseProps & {
  onClick: () => void;
};

type NavButtonProps = ButtonBaseProps & {
  to: string;
};

export default function Button({
  children,
  onClick,
  colorScheme,
  spacing,
}: ButtonProps) {
  return (
    <css.button onClick={onClick} colorScheme={colorScheme} spacing={spacing}>
      <css.buttonText>{children}</css.buttonText>
    </css.button>
  );
}

export function NavButton({
  children,
  to,
  colorScheme,
  spacing,
}: NavButtonProps) {
  return (
    <css.navButton
      role="button"
      to={to}
      colorScheme={colorScheme}
      spacing={spacing}
    >
      <css.buttonText>{children}</css.buttonText>
    </css.navButton>
  );
}
