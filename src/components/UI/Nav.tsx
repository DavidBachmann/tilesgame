import * as css from "./Nav.css";

export function Nav() {
  return (
    <css.root>
      <css.title>
        <span>TilesGame</span>
      </css.title>
      <css.content>
        <css.button data-active="true">Casual</css.button>
        <css.button data-active="false" title="Coming soon" disabled>
          Timed
        </css.button>
      </css.content>
    </css.root>
  );
}
