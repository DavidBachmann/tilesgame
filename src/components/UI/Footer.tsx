import { useConfig } from "../../context/ConfigContext";
import { Octocat } from "./artwork/Octocat";
import * as css from "./Footer.css";

export function Footer() {
  const config = useConfig();
  return (
    <css.root>
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
      <css.text>Seed: {config.seed}</css.text>
    </css.root>
  );
}
