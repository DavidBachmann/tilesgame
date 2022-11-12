import * as css from "./Nav.css";

export function Nav() {
  return (
    <css.root>
      <css.title>
        <span>TilesGame</span>
      </css.title>
      <css.content>
        <css.button
          data-active={location.href.includes("gameMode=casual")}
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
    </css.root>
  );
}
