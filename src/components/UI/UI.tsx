import { ReactNode } from "react";
import * as styles from "./UI.styles";

type UIProps = {
  children: ReactNode;
};

export function UI({ children }: UIProps) {
  return <styles.root>{children}</styles.root>;
}

export function Area({ children }: UIProps) {
  return <styles.area>{children}</styles.area>;
}
