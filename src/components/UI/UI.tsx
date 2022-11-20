import { ReactNode } from "react";
import { useConfig } from "../../context/ConfigContext";
import { usePlayer } from "../../context/PlayerContext";
import { useStore } from "../../StoreCreator";
import { Octocat } from "./artwork/Octocat";
import * as css from "./UI.css";

type UIProps = {
  children: ReactNode;
};

export default function UI({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <css.root>{children}</css.root>
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
        <span>Tiles</span>
      </css.title>
      <css.content>
        <css.navItem href="/">Casual</css.navItem>
        <css.navItem href="/time">Time</css.navItem>
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
