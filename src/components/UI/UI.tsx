import { ReactNode } from "react";
import { useConfig } from "../../context/ConfigContext";
import { usePlayer } from "../../context/PlayerContext";
import { Octocat } from "./artwork/Octocat";
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

function Nav() {
  return (
    <css.nav>
      <css.title>
        <span>TilesGame</span>
      </css.title>
      <css.content>
        <css.button
          data-active={!location.href.includes("gameMode=time-attack")}
          onClick={() => (location.href = "/?gameMode=casual")}
        >
          Casual
        </css.button>
        <css.button
          data-active={location.href.includes("gameMode=time-attack")}
          onClick={() => (location.href = "/?gameMode=time-attack")}
        >
          Timed
        </css.button>
      </css.content>
    </css.nav>
  );
}

export function Footer() {
  const config = useConfig();
  const player = usePlayer();
  return (
    <css.footer>
      <css.os>
        <a
          href="//github.com/DavidBachmann/tilesgame"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="visually-hidden">View the source on Github</span>
          <Octocat />
        </a>
      </css.os>
      <css.text>
        {player.alias} — {config.seed}
      </css.text>
    </css.footer>
  );
}
