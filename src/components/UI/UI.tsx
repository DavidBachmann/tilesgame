import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useConfig } from "../../context/ConfigContext";
import { usePlayer } from "../../context/PlayerContext";
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
  const { route } = useRouter();
  return (
    <css.nav>
      <css.title>
        <span>Tiles</span>
      </css.title>
      <css.content>
        <css.navItem
          disabled={route === "/"}
          data-active={route === "/"}
          href="/"
        >
          Casual
        </css.navItem>
        <css.navItem
          data-active={route === "/time"}
          disabled={route === "/time"}
          href="/time"
        >
          Time
        </css.navItem>
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

  return (
    <css.footer>
      <css.text>
        {player.alias} playing seed {config.seed}
      </css.text>
    </css.footer>
  );
}
