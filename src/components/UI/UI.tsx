import { ReactNode } from "react";
import * as css from "./UI.css";
import { Octocat } from "./artwork/Octocat";

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
      <a
        href="//github.com/DavidBachmann/tilesgame"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="visually-hidden">View the source on Github</span>
        <Octocat />
      </a>
    </css.header>
  );
}
