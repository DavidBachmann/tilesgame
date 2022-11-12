import { useConfig } from "../../context/ConfigContext";
import * as css from "./Footer.css";

export function Footer() {
  const config = useConfig();
  return (
    <css.root>
      <css.text>Seed: {config.seed}</css.text>
    </css.root>
  );
}
