import { ReactNode } from "react";
import * as css from "./Button.css";

type ButtonBaseProps = {
  children: ReactNode;
  type?: number;
};

type ButtonProps = ButtonBaseProps & {
  onClick: () => void;
};

export default function Button({ children, onClick, type = 0 }: ButtonProps) {
  return (
    <css.button onClick={onClick} data-type={type}>
      <css.buttonText>{children}</css.buttonText>
    </css.button>
  );
}
