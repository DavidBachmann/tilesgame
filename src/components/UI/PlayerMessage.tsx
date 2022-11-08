import * as css from "./PlayerMessage.css";

export function PlayerMessage({
  heading,
  subtitle,
}: {
  heading: string;
  subtitle?: string;
}) {
  return (
    <css.root
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 0,
      }}
      transition={{
        opacity: {
          type: "tween",
          duration: 0.3,
        },
        default: {
          type: "spring",
          stiffness: 80,
          mass: 0.8,
        },
      }}
    >
      <css.box>
        <css.message>{heading}</css.message>
        {subtitle && <css.small>{subtitle}</css.small>}
      </css.box>
    </css.root>
  );
}
