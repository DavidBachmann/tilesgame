import { ReactNode } from "react";
import { Nav } from "./Nav";
import * as css from "./UI.css";

type UIProps = {
  children: ReactNode;
};

export function UI({ children }: UIProps) {
  return <css.root>{children}</css.root>;
}

export function Area({ children }: UIProps) {
  return <css.area>{children}</css.area>;
}

export function Header() {
  return (
    <css.header>
      <Nav />
    </css.header>
  );
}
