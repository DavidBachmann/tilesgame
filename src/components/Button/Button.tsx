import { ReactNode } from "react";
import * as css from "./Button.css";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: number;
  type?: "button" | "submit";
};

type ButtonProps = ButtonBaseProps & {
  onClick: () => void;
};

export default function Button({
  children,
  onClick,
  type,
  variant = 0,
}: ButtonProps) {
  return (
    <css.button onClick={onClick} data-type={variant} type={type}>
      <css.buttonText>{children}</css.buttonText>
    </css.button>
  );
}
