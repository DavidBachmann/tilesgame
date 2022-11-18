import { ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useConfig } from "../../context/ConfigContext";
import { usePlayer } from "../../context/PlayerContext";
import { useStore } from "../../StoreCreator";
import Button from "../Button";
import { NavButton } from "../Button/Button";
import { Octocat } from "./artwork/Octocat";
import * as css from "./UI.css";

type UIProps = {
  children: ReactNode;
};

export function UI() {
  return (
    <>
      <Header />
      <css.root>
        <Outlet />
      </css.root>
      <Footer />
    </>
  );
}

export function GameArea({ children }: UIProps) {
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
        <css.navItem to="/">Casual</css.navItem>
        <css.navItem to="/time">Time</css.navItem>
      </css.content>
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
    </css.nav>
  );
}

export function Footer() {
  const config = useConfig();
  const player = usePlayer();
  const game = useStore((store) => store.game);

  return (
    <css.footer>
      <css.text>
        {player.alias} playing {game.id} (seed {config.seed})
      </css.text>
    </css.footer>
  );
}
