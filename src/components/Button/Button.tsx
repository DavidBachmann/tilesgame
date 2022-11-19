import { ReactNode } from "react";
import Link from "next/link";
import * as css from "./Button.css";

type ButtonBaseProps = {
  children: ReactNode;
  type?: number;
};

type ButtonProps = ButtonBaseProps & {
  onClick: () => void;
};

type NavButtonProps = ButtonBaseProps & {
  to: string;
};

export default function Button({ children, onClick, type = 0 }: ButtonProps) {
  return (
    <css.button onClick={onClick} data-type={type}>
      <css.buttonText>{children}</css.buttonText>
    </css.button>
  );
}

export function NavButton({ children, to, type = 0 }: NavButtonProps) {
  return (
    <css.button as={Link} role="button" to={to} data-type={type}>
      <css.buttonText>{children}</css.buttonText>
    </css.button>
  );
}
